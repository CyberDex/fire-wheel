import { Text } from "@pixi/text";
import { gsap } from "gsap";

export function updateNumber(text: Text, balance: number) {
    const currentBalance = {
        balance: parseInt(text.text)
    };

    gsap.to(currentBalance, {
        balance,
        duration: 1,
        onUpdate: () => { 
            text.text = `${Math.round(currentBalance.balance)}`;
        }
    });
}