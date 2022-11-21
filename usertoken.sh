curl -k -X POST "$VIYA_SERVER/SASLogon/oauth/clients/consul?callback=false&serviceId=viyaeditorx" -H "X-Consul-Token: $CONSUL_TOKEN" >usertoken.json
