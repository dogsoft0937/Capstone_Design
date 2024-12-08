const { startPeriodicScan, setupTrapListener } = require("../services/snmpService");
const prisma = require("../lib/prisma");

async function test() {
    console.log('SNMP 모니터링 테스트 시작...');
    console.log('1시간 간격으로 네트워크 스캔을 실행합니다.');
    console.log('SNMP 트랩 리스너가 활성화되었습니다.');
    console.log(new Date().toLocaleString());

    try {
        // 트랩 리스너 시작
        const trapListener = setupTrapListener();
        
        // 주기적 스캔 시작
        await startPeriodicScan();

        // 스캔 완료 이벤트 처리
        process.on('scanComplete', (result) => {
            console.log('\n=== 스캔 완료 알림 ===');
            console.log('처리된 장치:', result.devicesProcessed);
            console.log('데이터베이스 현황:', result.summary);
        });

    } catch (error) {
        console.error("테스트 실패:", error);
        await prisma.$disconnect();
    }
}

// 프로세스 종료 처리
process.on('SIGINT', async () => {
    console.log('\n테스트를 종료합니다...');
    await prisma.$disconnect();
    process.exit();
});

test(); 