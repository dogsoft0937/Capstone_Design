import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "API 문서",
        description: "API",
    },
    // host: "172.30.1.38:2306", 이건 밖에서 나랑할때 쓰세요 ^.^
    host:"127.0.0.1:2306",
    schemes: ["http"],
};

const outputFile = "./src/config/swagger.json"; // 생성할 Swagger JSON 파일 경로
const endpointsFiles = ["./src/app.ts"]; // API 엔드포인트 파일 경로

swaggerAutogen()(outputFile, endpointsFiles, doc);
