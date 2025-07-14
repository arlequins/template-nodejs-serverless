#!/bin/bash
read -p "GCP Agent JSON file path: " KEY_PATH
base64 -i "${KEY_PATH}" -o gcp_key_base.txt
