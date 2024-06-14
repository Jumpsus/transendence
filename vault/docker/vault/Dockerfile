FROM hashicorp/vault

RUN mkdir -p /vault/

COPY vault-init.sh /usr/local/bin/vault-init.sh

COPY config.hcl /vault/config/config.hcl

RUN chmod 777 /usr/local/bin/vault-init.sh

RUN [ "/usr/local/bin/vault-init.sh" ]

ENTRYPOINT [ "vault" ]
CMD [ "server", "-config=/vault/config" ]
