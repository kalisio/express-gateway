#!/bin/bash

# Parcours de tous les fichiers journaux de test
for log_file in $(find . -name "test-results.log"); do
    # Extraire le nom du fichier de log et la version de Node.js
    node_version=$(echo "$log_file" | cut -d '/' -f 2)
    echo "Node.js version: $node_version" >> all_test_results.txt

    # Extraire les résultats des tests
    test_results=$(grep -E "^\s*[0-9]+\s+(passing|failing)" "$log_file")
    echo "$test_results" >> all_test_results.txt
    echo "-----------------------" >> all_test_results.txt
done
