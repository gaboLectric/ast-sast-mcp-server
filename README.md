# AST-SAST MCP Server

<div align="center">

![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MCP](https://img.shields.io/badge/MCP-Compatible-orange)

**Análisis estático de seguridad y calidad para tus Agentes de IA.**
*Evita vulnerabilidades antes de que el código llegue a tu editor.*

</div>

---

## ❌ Sin AST-SAST
Los LLMs generan código basándose en patrones probabilísticos, a menudo ignorando contextos de seguridad críticos. Obtienes:

❌ **Código inseguro**: Sugerencias con `eval()` o inyecciones de comandos.
❌ **Secretos expuestos**: Credenciales hardcodeadas que terminan en tus repositorios.
❌ **Malas prácticas**: Uso de `console.log` en producción o funciones obsoletas.

## ✅ Con AST-SAST
Este servidor MCP intercepta el código generado y lo analiza utilizando el compilador real de TypeScript (AST), no simples expresiones regulares.

1️⃣ **Escribe tu prompt** normalmente.
2️⃣ **El Agente consulta** automáticamente al servidor AST-SAST.
3️⃣ **Recibes código validado** o advertencias claras sobre riesgos.

---

## 🛠️ Instalación

### Requisitos
- Node.js >= v18.0.0
- Un cliente MCP (Claude Desktop, VS Code con Copilot, Cursor, etc.)

### Pasos

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/gaboLectric/ast-sast-mcp-server
    cd ast-sast-mcp-server
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Compilar**:
    ```bash
    npm run build
    ```

---

## ⚙️ Configuración

Agrega este servidor a tu cliente MCP favorito.

### Claude Desktop / VS Code

Edita tu archivo de configuración (ej. `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "ast-sast": {
      "command": "node",
      "args": [
        "/ruta/absoluta/a/ast-sast-mcp-server/build/server.js"
      ]
    }
  }
}
```
> 💡 **Tip**: Asegúrate de usar la ruta absoluta a la carpeta `build/server.js`.

---

## � Herramientas Disponibles

Este servidor expone las siguientes herramientas para tu LLM:

### `security_review`
Analiza un fragmento de código en busca de vulnerabilidades.

- **Input**: `code` (string) - El código fuente a analizar.
- **Output**: Reporte de hallazgos (Críticos, Advertencias).

**Reglas actuales:**
- 🚫 **No Eval**: Detecta uso de `eval()`.
- 🔐 **No Secrets**: Detecta variables con nombres sospechosos (`password`, `token`) y valores hardcodeados.
- 🧹 **No Console**: Advierte sobre `console.log` (sugerencia de calidad).

---

## 💻 Desarrollo

Si quieres contribuir o modificar las reglas:

1.  Edita `src/analyzer.ts` para agregar nuevas visitas al AST.
2.  Recompila con `npm run build`.
3.  Prueba tus cambios localmente con el script de demo:

```bash
npm run demo
```

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Siéntete libre de usarlo y modificarlo.
