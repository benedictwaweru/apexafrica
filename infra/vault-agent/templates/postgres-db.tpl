{{- with secret "secret/data/postgres" -}}
{{ .Data.data.database }}
{{- end -}}
