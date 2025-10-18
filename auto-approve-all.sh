#!/bin/bash

# ⚠️  WARNUNG: Dieses Script approved ALLE Befehle automatisch!
# Dies kann gefährlich sein - destruktive Befehle werden ohne Rückfrage ausgeführt!

# Methode 1: Erstelle/Update Claude Code Config mit auto-approval Hook
CONFIG_DIR="$HOME/.config/claude"
CONFIG_FILE="$CONFIG_DIR/config.json"

# Erstelle Config Directory falls nicht vorhanden
mkdir -p "$CONFIG_DIR"

# Erstelle oder überschreibe die Config
cat > "$CONFIG_FILE" << 'EOF'
{
  "hooks": {
    "command-approval": {
      "command": "echo approved"
    }
  },
  "autoApprovedCommands": [
    "*"
  ]
}
EOF

echo "✅ Claude Code Konfiguration wurde aktualisiert!"
echo "📍 Konfigurationsdatei: $CONFIG_FILE"
echo ""
echo "⚠️  WARNUNG: Alle Befehle werden jetzt automatisch bestätigt!"
echo "Um dies rückgängig zu machen, lösche die Datei: $CONFIG_FILE"
echo ""
echo "Starte Claude Code neu, damit die Änderungen wirksam werden."
