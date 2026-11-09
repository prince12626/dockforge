FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        bash-completion \
        build-essential \
        ca-certificates \
        curl \
        dnsutils \
        file \
        git \
        gnupg \
        htop \
        iputils-ping \
        jq \
        less \
        lsof \
        nano \
        net-tools \
        openssl \
        procps \
        psmisc \
        python3 \
        python3-pip \
        sudo \
        tar \
        unzip \
        vim \
        wget \
        zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

CMD ["sleep", "infinity"]
