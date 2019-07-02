#!/bin/bash
# Commands for Debian 8 (Jessie) for obtaining SSL artifacts

# Prequisites
# Must have
# Must enable IPv6 and update A/AAAA DNS records
apt-get remove certbot # Y/n
wget https://dl.eff.org/certbot-auto
mv certbot-auto /usr/local/bin/certbot-auto
chown root /usr/local/bin/certbot-auto # probably unnecessary
chmod +x /usr/local/bin/certbot-auto

ufw allow 80 # allow port 80
/usr/local/bin/certbot certonly --standalone --preferred-challenges http -d example.com

ufw allow 443 # allow port 443
/usr/local/bin/certbot certonly --standalone --preferred-challenges tls-sni http -d example.com

# certificate and chain have been saved at:
# /etc/letsencrypt/live/example.com/fullchain.pem

# your key file has been saved at:
# /etc/letsencrypt/live/example.com/privkey.pemls

mkdir certs