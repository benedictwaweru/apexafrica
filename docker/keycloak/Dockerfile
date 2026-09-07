FROM quay.io/keycloak/keycloak:26.6.1 AS builder

ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true
ENV KC_DB=postgres

WORKDIR /opt/keycloak

COPY providers/keycloak-2fa-email-authenticator-*.jar /opt/keycloak/providers/

COPY config/realm.json /opt/keycloak/data/import/realm.json

RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.6.1

WORKDIR /opt/keycloak

COPY --from=builder /opt/keycloak/ /opt/keycloak/

EXPOSE 8080 8443
