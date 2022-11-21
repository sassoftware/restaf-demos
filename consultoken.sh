kubectl -n viya get secret sas-consul-client -o jsonpath="{.data.CONSUL_TOKEN}" | echo "$(base64 -d)" >consul_token
