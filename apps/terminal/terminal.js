const output = document.getElementById("terminal-output");
const input = document.getElementById("terminal-input");

const prompt = "david@CV ~ $";

const softSkills = [
    "Trabajo en equipo",
    "Meticulosidad",
    "Comunicación asertiva",
    "Flexibilidad",
    "Constancia",
    "Curiosidad"
];

print("Escribe 'help' para ver los comandos disponibles\n");

input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    const command = input.value.trim();
    print(`${prompt} ${command}`);
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
            print("softskills  → Muestra las soft skills de David");
            break;

        case "softskills":
            softSkills.forEach(skill => print(skill));
            break;

        case "":
            break;

        default:
            print(`command not found: ${cmd}`);
    }
}
