#!/bin/bash
# selective_copy.sh

OUTPUT_FILE="selected_code_export.txt"
REPO_NAME=$(basename "$PWD")

echo "📁 Select files to export from: $REPO_NAME"
echo "========================================"

# Show available files
echo ""
echo "Available files in src/:"
find src -name "*.js" -o -name "*.gs" | sort | nl -w2 -s': '

echo ""
echo "Enter file numbers to export (space-separated, or 'all'):"
read -p "> " SELECTION

echo "========================================" > "$OUTPUT_FILE"
echo "REPO: $REPO_NAME" >> "$OUTPUT_FILE"
echo "DATE: $(date)" >> "$OUTPUT_FILE"
echo "========================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

if [ "$SELECTION" = "all" ]; then
    find src -name "*.js" -o -name "*.gs" | sort | while read FILE; do
        echo "📄 Adding: $(basename "$FILE")"
        echo "// FILE: $(basename "$FILE")" >> "$OUTPUT_FILE"
        echo "// ==============================================" >> "$OUTPUT_FILE"
        cat "$FILE" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    done
else
    for NUM in $SELECTION; do
        FILE=$(find src -name "*.js" -o -name "*.gs" | sort | sed -n "${NUM}p")
        if [ -n "$FILE" ]; then
            echo "📄 Adding: $(basename "$FILE")"
            echo "// FILE: $(basename "$FILE")" >> "$OUTPUT_FILE"
            echo "// ==============================================" >> "$OUTPUT_FILE"
            cat "$FILE" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
        fi
    done
fi

echo "✅ Done! Exported to: $OUTPUT_FILE"