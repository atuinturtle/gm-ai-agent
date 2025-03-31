interface Character {
    name: string;
    look: string;
    background: string;
    heritage: string;
    actions: Action[];
    abilities: Ability[];
    friend: string;
    rival: string;
    notes: string;
}

interface Action {
    name: string;
    value: number;
    description: string;
    attribute: "insight" | "prowess" | "resolve";
}

interface Ability {
    name: string;
    description: string;
}

