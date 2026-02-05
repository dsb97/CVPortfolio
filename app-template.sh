#!/bin/bash

# Verificar parámetro
if [ -z "$1" ]; then
  echo "Uso: $0 nombreApp"
  exit 1
fi

NOMBRE=$1
DIR="./apps/$NOMBRE"

# Crear directorio
mkdir -p "$DIR"

# Crear ficheros
cat > "$DIR/$NOMBRE.js" <<EOF
window.${NOMBRE}Init = (winId, options) => {
  let win = window.getWindow(winId);
}

window.${NOMBRE}Dispose = () => {}
EOF

cat > "$DIR/$NOMBRE.html" <<EOF
<div id="${NOMBRE}-container">
</div>
EOF

cat > "$DIR/$NOMBRE.css" <<EOF
/* Estilos para ${NOMBRE} */
EOF

echo "Archivos creados en $DIR"
