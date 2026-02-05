window.terminalInit = (winId, options) => {
    const output = window.getWindow(winId).querySelector("#terminal-output");
    const input = window.getWindow(winId).querySelector("#terminal-input");
    const prompt = "david@CV ~ $";

    const softSkills = [
        "Trabajo en equipo",
        "Meticulosidad",
        "Comunicación asertiva",
        "Flexibilidad",
        "Constancia",
        "Curiosidad"
    ];

    input.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;

        const command = input.value.trim();
        print()
        print(`${prompt} ${command}`);
        print()
        handleCommand(command.toLowerCase());
        input.value = "";
    });

    function print(text = "") {
        output.textContent += text + "\n";
        output.scrollTop = output.scrollHeight;
    }

    function handleCommand(cmd) {
        switch (cmd) {
            case "help":
                print("clear: limpia la pantalla");
                print("softskills: muestra las soft skills de David");
                break;
            case "softskills":
                softSkills.forEach(skill => print(skill));
                break;
            case 'clear':
                output.innerHTML = '';
            case "":
                break;

            default:
                print(`comando no encontrado: ${cmd}`);
        }
        
    }
    print("Escribe 'help' para ver los comandos disponibles\n");
}

window.terminalDispose = () => {
}