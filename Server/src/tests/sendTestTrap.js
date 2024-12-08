import snmp from 'net-snmp';

function sendTestTrap() {
    const session = snmp.createSession("127.0.0.1", "public");

    // 포트 상태 변경 트랩
    const trapOid = "1.3.6.1.6.3.1.1.5.3"; // linkDown 트랩
    const portNumber = 1; // 테스트할 포트 번호

    const varbinds = [
        {
            oid: "1.3.6.1.2.1.1.3.0",
            type: snmp.ObjectType.TimeTicks,
            value: 123
        },
        {
            oid: "1.3.6.1.6.3.1.1.4.1.0",
            type: snmp.ObjectType.OID,
            value: trapOid
        },
        {
            // 포트 상태
            oid: `1.3.6.1.2.1.2.2.1.8.${portNumber}`,
            type: snmp.ObjectType.Integer,
            value: 2  // 2 = Down
        },
        {
            // 인바운드 트래픽
            oid: `1.3.6.1.2.1.2.2.1.10.${portNumber}`,
            type: snmp.ObjectType.Counter32,
            value: 1000
        },
        {
            // 아웃바운드 트래픽
            oid: `1.3.6.1.2.1.2.2.1.16.${portNumber}`,
            type: snmp.ObjectType.Counter32,
            value: 2000
        }
    ];

    console.log('테스트 트랩 전송 중...');
    
    session.trap(trapOid, varbinds, (error) => {
        if (error) {
            console.error('트랩 ��송 실패:', error);
        } else {
            console.log('트랩 전송 성공!');
        }
        session.close();
    });
}

setInterval(sendTestTrap, 3000);
console.log('트랩 테스트 시작 (Ctrl+C로 종료)');
sendTestTrap();