{{- with secret "secret/data/postgres" -}}
{{ .Data.data.username }}
{{- end -}}
