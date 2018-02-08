FROM 100.125.0.198:20202/hwcse/dockerhub-java:8-jre-alpine

RUN mkdir -p /maven/acmeair/lib

COPY target/hwtraining-edge-service-0.0.1-SNAPSHOT.jar  /maven/acmeair/

COPY target/lib /maven/acmeair/lib

ENTRYPOINT java $AK $SK -jar /maven/acmeair/hwtraining-edge-service-0.0.1-SNAPSHOT.jar