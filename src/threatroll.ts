class Threatroll {
    constructor() {
    }

    public threatroll(rating: number) {
        console.log("Threatroll");

        const rolls = [];
        for (let i = 0; i < rating; i++) {
            rolls.push(Math.floor(Math.random() * 6) + 1);
        }

        console.log(rolls);

        return rolls;
    }
}

export default Threatroll;