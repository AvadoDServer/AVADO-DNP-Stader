#!/bin/bash

NETWORK=${NETWORK}
CONSENSUSCLIENT=${CONSENSUSCLIENT}

case ${NETWORK} in
"mainnet" | "prater") ;;

*)
    echo "Invalid NETWORK configured"
    exit -1
    ;;
esac

case ${CONSENSUSCLIENT} in
"teku" | "prysm") ;;

*)
    echo "Invalid CONSENSUSCLIENT configured"
    exit -1
    ;;
esac
case ${EXECUTIONCLIENT} in
"geth" | "nethermind") ;;

*)
    echo "Invalid EXECUTIONCLIENT configured"
    exit -1
    ;;
esac

if [ "${EXECUTIONCLIENT}" = "nethermind" ]; then
    ECHTTPURL="http://avado-dnp-nethermind.my.ava.do:8545"
    ECWSURL="ws://avado-dnp-nethermind.my.ava.do:8545"
else
    if [ "${NETWORK}" = "prater" ]; then
        ECHTTPURL="http://goerli-geth.my.ava.do:8545"
        ECWSURL="ws://goerli-geth.my.ava.do:8546"
    else
        ECHTTPURL="http://ethchain-geth.my.ava.do:8545"
        ECWSURL="ws://ethchain-geth.my.ava.do:8546"
    fi
fi

if [ "${CONSENSUSCLIENT}" = "teku" ]; then
    if [ "${NETWORK}" = "prater" ]; then
        BCHTTPURL="http://teku-prater.my.ava.do:5051"
    else
        BCHTTPURL="http://teku.my.ava.do:5051"
    fi
    BCJSONRPCURL=""
else
    BCHTTPURL="http://prysm-beacon-chain-${NETWORK}.my.ava.do:3500"
    BCJSONRPCURL="http://prysm-beacon-chain-${NETWORK}.my.ava.do:4000"
fi

# Make sure the data folders exists
mkdir -p /.stader
mkdir -p /.stader/data
mkdir -p /.stader/data/sp-rewards-merkle-proofs

echo "------START stader folder config------"
ls -lR /.stader/
echo "------END stader folder config------"

NETWORK="${NETWORK}" \
    CONSENSUSCLIENT="${CONSENSUSCLIENT}" \
    ECHTTPURL="${ECHTTPURL}" \
    ECWSURL="${ECWSURL}" \
    BCHTTPURL="${BCHTTPURL}" \
    NETWORK="${NETWORK}" \
    BCJSONRPCURL="${BCJSONRPCURL}" \
    envsubst < /stader/user-settings.template > /.stader/user-settings.yml

# Create folder for rewards trees
# mkdir -p /.stader/rewards-trees/

# Start stader node daemon
exec /go/bin/stader node


echo "Stader daemon exited. Waiting to restart"
sleep 60
