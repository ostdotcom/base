#!/bin/bash
curl https://gethstore.blob.core.windows.net/builds/geth-linux-386-1.8.17-8bbe7207.tar.gz | tar xvz
mv geth-linux-386-1.8.17-8bbe7207 /usr/local/bin
ln -s /usr/local/bin/geth-linux-386-1.8.17-8bbe7207/geth /usr/local/bin/geth
export PATH="$PATH:/usr/local/bin/geth-linux-386-1.8.17-8bbe7207"
