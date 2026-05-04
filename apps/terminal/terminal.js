window.terminalInit = (winId, options) => {
    const output = window.getWindow(winId).querySelector("#terminal-output");
    const input = window.getWindow(winId).querySelector("#terminal-input");
    const prompt = "david@CV ~ $";

    const softSkillKeys = [
        "terminal.skill.teamwork",
        "terminal.skill.thoroughness",
        "terminal.skill.communication",
        "terminal.skill.flexibility",
        "terminal.skill.consistency",
        "terminal.skill.curiosity"
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
                print(window.t("terminal.helpClear"));
                print(window.t("terminal.helpSoftskills"));
                break;
            case "softskills":
                softSkillKeys.forEach(skillKey => print(window.t(skillKey)));
                break;
            case 'clear':
                output.innerHTML = '';
            case "":
                break;

            default:
                print(`${window.t("terminal.commandNotFound")}: ${cmd}`);
        }
        
    }
    print(`${window.t("terminal.helpPrompt")}\n`);
}

window.terminalDispose = () => {
}
