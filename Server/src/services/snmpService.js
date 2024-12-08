import snmp from 'net-snmp';
import prisma from '../lib/prisma.js';
import os from 'os';
import { broadcastTrap } from './websocketService.js';

// 현재 네트워크 IP와 서브넷 찾기
const getLocalNetwork = () => {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // IPv4이고 내부 네트워크 주소인 경우
            if (net.family === 'IPv4' && !net.internal) {
                const ip = net.address;
                const subnet = ip.split('.').slice(0, 3).join('.');
                return { ip, subnet };
            }
        }
    }
    throw new Error('네트워크 인터페이스를 찾을 수 없습니다.');
};

// 네트워크 스캔 함수
const scanNetwork = async (subnet) => {
    const devices = [];
    
    for(let i = 1; i < 255; i++) {
        const ip = `${subnet}.${i}`;
        console.log(`스캔 중: ${ip}`);
        
        try {
            await testSNMP(ip);
            devices.push(ip);
            console.log(`✅ 발견된 SNMP 장치: ${ip}`);
        } catch(e) {
            console.log(`❌ SNMP 미응답: ${ip}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return devices;
};

// SNMP 테스트 함수 - 타임아웃 시간 줄임
const testSNMP = (ip) => {
    return new Promise((resolve, reject) => {
        let isCompleted = false;
        const session = snmp.createSession(ip, "public");
        
        session.get(["1.3.6.1.2.1.1.1.0"], (error, varbinds) => {
            if (!isCompleted) {
                isCompleted = true;
                if (error) {
                    reject(error);
                } else {
                    resolve(true);
                }
                try {
                    session.close();
                } catch (e) {}
            }
        });

        // 타임아웃 시간 줄임
        setTimeout(() => {
            if (!isCompleted) {
                isCompleted = true;
                try {
                    session.close();
                } catch (e) {}
                reject(new Error("timeout"));
            }
        }, 500);  // 0.5초로 줄임
    });
};

// 주기적 스캔 실행
const startPeriodicScan = async () => {
    try {
        const { ip, subnet } = getLocalNetwork();
        console.log(`로컬 IP: ${ip}`);
        console.log(`네트워크 대역: ${subnet}.0/24`);
        
        // 첫 실행
        await scanAndPoll();
        
        // 1시간마다 스캔 실행
        setInterval(async () => {
            console.log('\n=== 정기 스캔 시작 ===');
            console.log(new Date().toLocaleString());
            await scanAndPoll();
        }, 60 * 60 * 1000); // 1시간 = 60 * 60 * 1000 밀리초
        
    } catch (error) {
        console.error("주기적 스캔 설정 실패:", error);
    }
};

// 스캔 및 폴링 실행
const scanAndPoll = async () => {
    try {
        const { subnet } = getLocalNetwork();
        console.log(`\n네트워크 스캔 시작: ${subnet}.0/24`);
        console.log('시작 시간:', new Date().toLocaleString());
        
        const devices = await scanNetwork(subnet);
        console.log(`발견된 총 SNMP 장치 수: ${devices.length}`);
        
        let completedDevices = 0;
        for(const ip of devices) {
            console.log(`\n${ip} 장치 정보 수집 중... (${completedDevices + 1}/${devices.length})`);
            await pollDevice(ip);
            completedDevices++;
        }

        // 수집 완료 메시지
        console.log('\n=== 장치 정보 수집 완료 ===');
        console.log('완료 시간:', new Date().toLocaleString());
        console.log(`처리된 장치: ${completedDevices}/${devices.length}`);
        
        // 수집된 데이터 요약
        const summary = await prisma.$transaction([
            prisma.device.count(),
            prisma.port.count(),
            prisma.trafficStat.count(),
            prisma.event.count()
        ]);

        console.log('\n=== 데이터베이스 현황 ===');
        console.log('총 장치 수:', summary[0]);
        console.log('총 포트 수:', summary[1]);
        console.log('트래픽 통계 수:', summary[2]);
        console.log('이벤트 수:', summary[3]);
        console.log('===============================\n');

        return {
            devicesFound: devices.length,
            devicesProcessed: completedDevices,
            summary: {
                devices: summary[0],
                ports: summary[1],
                trafficStats: summary[2],
                events: summary[3]
            }
        };
    } catch (error) {
        console.error("스캔 실패:", error);
        throw error;
    }
};

// pollDevice 함수 수정
const pollDevice = async (deviceIP) => {
    const session = snmp.createSession(deviceIP, "public");

    // 시스템 정보 + 포트 + 트래픽 정보를 위한 OID
    const oids = [
        "1.3.6.1.2.1.1.1.0",     // system description
        "1.3.6.1.2.1.1.5.0",     // device name
        "1.3.6.1.2.1.2.1.0",     // ifNumber (인터페이스 수)
    ];

    return new Promise(async (resolve, reject) => {
        try {
            session.get(oids, async (error, varbinds) => {
                if (error) {
                    console.error("SNMP 폴링 오류:", error);
                    session.close();
                    reject(error);
                    return;
                }

                try {
                    // Device 정보 저장/업데이트
                    const device = await prisma.device.upsert({
                        where: { deviceIP },
                        update: {
                            deviceName: varbinds[1]?.value?.toString() || "Unknown Device",
                            status: "Online",
                            lastChecked: new Date()
                        },
                        create: {
                            deviceIP,
                            deviceName: varbinds[1]?.value?.toString() || "Unknown Device",
                            status: "Online",
                            lastChecked: new Date()
                        }
                    });

                    // 포트 정보 수집
                    const ifNumber = varbinds[2]?.value || 1;
                    for (let portNum = 1; portNum <= ifNumber; portNum++) {
                        const portOids = [
                            `1.3.6.1.2.1.2.2.1.8.${portNum}`,    // ifOperStatus
                            `1.3.6.1.2.1.2.2.1.14.${portNum}`,   // ifInErrors
                            `1.3.6.1.2.1.2.2.1.10.${portNum}`,   // ifInOctets
                            `1.3.6.1.2.1.2.2.1.16.${portNum}`,   // ifOutOctets
                        ];

                        session.get(portOids, async (portError, portVarbinds) => {
                            if (!portError) {
                                // 포트 정보 저장/업데이트
                                const port = await prisma.port.upsert({
                                    where: {
                                        id: `${device.id}-${portNum}`
                                    },
                                    update: {
                                        portStatus: portVarbinds[0]?.value === 1 ? "Up" : "Down",
                                        errorCount: parseInt(portVarbinds[1]?.value || "0")
                                    },
                                    create: {
                                        id: `${device.id}-${portNum}`,
                                        portNumber: portNum,
                                        portStatus: portVarbinds[0]?.value === 1 ? "Up" : "Down",
                                        errorCount: parseInt(portVarbinds[1]?.value || "0"),
                                        deviceId: device.id
                                    }
                                });

                                // 트래픽 통계 저장
                                await prisma.trafficStat.create({
                                    data: {
                                        timestamp: new Date(),
                                        inboundTraffic: BigInt(portVarbinds[2]?.value || "0"),
                                        outboundTraffic: BigInt(portVarbinds[3]?.value || "0"),
                                        portId: port.id,
                                        deviceId: device.id
                                    }
                                });
                            }
                        });
                    }

                    // 이벤트 생성
                    await prisma.event.create({
                        data: {
                            eventType: "Normal",
                            severity: "Info",
                            message: `Device polled successfully: ${varbinds[0]?.value?.toString()}`,
                            timestamp: new Date(),
                            deviceId: device.id
                        }
                    });

                    session.close();
                    resolve();
                } catch (dbError) {
                    console.error("데이터베이스 저장 오류:", dbError);
                    reject(dbError);
                }
            });
        } catch (error) {
            console.error("SNMP 세션 오류:", error);
            reject(error);
        }
    });
};

// handleTrap 함수 추가
async function handleTrap(deviceIP, varbinds) {
    try {
        console.log('\n=== 트랩 처리 시작 ===');
        console.log('장치 IP:', deviceIP);
        
        // 장치 찾기 또는 생성
        const device = await prisma.device.upsert({
            where: { deviceIP },
            update: { lastChecked: new Date() },
            create: {
                deviceIP,
                deviceName: `Unknown Device (${deviceIP})`,
                status: 'Online',
                lastChecked: new Date()
            }
        });

        // varbinds 처리
        for (const vb of varbinds) {
            console.log('OID:', vb.oid);
            console.log('Value:', vb.value);
            
            // 포트 상태 변경 처리
            if (vb.oid.startsWith('1.3.6.1.2.1.2.2.1.8.')) {
                const portNumber = parseInt(vb.oid.split('.').pop());
                await prisma.port.upsert({
                    where: {
                        id: `${device.id}-${portNumber}`
                    },
                    update: {
                        portStatus: vb.value === 1 ? 'Up' : 'Down'
                    },
                    create: {
                        id: `${device.id}-${portNumber}`,
                        portNumber: portNumber,
                        portStatus: vb.value === 1 ? 'Up' : 'Down',
                        deviceId: device.id,
                        errorCount: 0
                    }
                });
            }
        }

        // 이벤트 생성
        await prisma.event.create({
            data: {
                eventType: 'Trap',
                severity: 'Warning',
                message: `SNMP Trap received from ${deviceIP}`,
                timestamp: new Date(),
                deviceId: device.id
            }
        });

        console.log('트랩 처리 완료');
        
    } catch (error) {
        console.error('트랩 처리 중 오류:', error);
        throw error;
    }
}

function setupTrapListener() {
    try {
        const receiver = snmp.createReceiver({
            port: 162,
            disableAuthorization: true,
            accessControlModelType: snmp.AccessControlModelType.None
        }, function(error, notification) {
            if (error) {
                console.error('트랩 수신 오류:', error);
                return;
            }

            const rinfo = notification.rinfo;
            const varbinds = notification.pdu.varbinds;

            console.log('\n=== SNMP 트랩 수신 ===');
            console.log('발신지:', rinfo.address);
            console.log('시간:', new Date().toLocaleString());

            // 웹소켓으로 트랩 정보 전송
            const trapInfo = {
                source: rinfo.address,
                timestamp: new Date().toISOString(),
                varbinds: varbinds.map(vb => ({
                    oid: vb.oid,
                    value: vb.value
                }))
            };
            broadcastTrap(trapInfo);

            // 트랩 처리
            handleTrap(rinfo.address, varbinds).catch(err => {
                console.error('트랩 처리 중 오류:', err);
            });
        });

        console.log('SNMP 트랩 리스너가 시작되었습니다.');
        return receiver;

    } catch (error) {
        console.error('트랩 리스너 생성 실패:', error);
        throw error;
    }
}

// startSnmpService 함수 선언
async function startSnmpService() {
    console.log('SNMP 서비스를 시작합니다...');
    setupTrapListener();
    await startPeriodicScan();
}

// 한 번에 모든 함수 export
export {
    startSnmpService,
    setupTrapListener,
    scanNetwork,
    testSNMP,
    pollDevice
}; 