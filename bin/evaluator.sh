#!/usr/bin/env bash
SPC_LOG_LEVEL_STDOUT=trace spc-evaluator-logs | bunyan -o json --strict | json -d ' -|- ' -ga msg expressionString evalResult
