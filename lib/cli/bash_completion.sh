#!/usr/bin/env bash

_appril_dbx() {

  local cur prev opts

  COMPREPLY=()

  cur="${COMP_WORDS[COMP_CWORD]}"
  prev="${COMP_WORDS[COMP_CWORD-1]}"
  opts="-c -g -m"

  case "${prev}" in
    -c)
      opts=$(ls dbx.*.ts)
      ;;
    -g)
      opts="types tables views"
      ;;
    -m)
      opts="create up down latest rollback list compile"
      ;;
    rollback)
      opts="--all"
      ;;
    *)
      ;;
  esac

  COMPREPLY=($(compgen -W "$opts" -- $cur))
  return 0

}

complete -F _appril_dbx appril-dbx

