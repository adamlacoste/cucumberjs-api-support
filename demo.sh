#!/bin/bash

cwd="$(pwd)"
cd app/ && node .
cd $cwd
