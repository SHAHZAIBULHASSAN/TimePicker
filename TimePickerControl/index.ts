import { IInputs, IOutputs } from "./generated/ManifestTypes";
import'./CSS/TimePickerControl.css';
export class TimePickerControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container: HTMLDivElement;
    private notifyOutputChanged: () => void;
    private selectedHour = 3;
    private selectedMinute = 30;
    private selectedAmPm = "PM";
    private timePickerDiv!: HTMLDivElement;
    private timeInput!: HTMLInputElement;

    constructor() {
        this.timePickerDiv = document.createElement("div");
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;

        // 📌 Input Container
        const inputContainer = document.createElement("div");
        inputContainer.classList.add("input-container");

        // 🕒 Time Input Field
        this.timeInput = document.createElement("input");
        this.timeInput.type = "text";
        this.timeInput.value = `${this.selectedHour}:${this.selectedMinute} ${this.selectedAmPm}`;
        this.timeInput.readOnly = true;
        this.timeInput.style.border = "none";
        this.timeInput.style.outline = "none";
        this.timeInput.style.background = "transparent";
        this.timeInput.style.fontSize = "16px";
        this.timeInput.style.width = "90px";

        // ⏰ Clock Icon
        const clockIcon = document.createElement("span");
        clockIcon.classList.add("clock-icon");
        clockIcon.innerHTML = "🕒";
        clockIcon.addEventListener("click", () => {
            this.timePickerDiv.classList.toggle("show");
        });

        inputContainer.append(this.timeInput, clockIcon);

        // 🕑 Time Picker Dropdown
        this.timePickerDiv = document.createElement("div");
        this.timePickerDiv.classList.add("time-picker-container");

        // 🔄 Time Grid
        const timeGrid = document.createElement("div");
        timeGrid.classList.add("time-grid");

        // ⬆⬇ Arrows + Time
        const hourBox = this.createTimeSelector("hour", 1, 12);
        const minuteBox = this.createTimeSelector("minute", 0, 59);
        const amPmBox = this.createTimeSelector("ampm", ["AM", "PM"]);

        timeGrid.append(hourBox, this.createColon(), minuteBox, amPmBox);

        // ❌✅ Buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        const cancelButton = document.createElement("button");
        cancelButton.innerText = "CANCEL";
        cancelButton.addEventListener("click", () => {
            this.timePickerDiv.classList.remove("show");
        });

        const okButton = document.createElement("button");
        okButton.innerText = "OK";
        okButton.addEventListener("click", () => {
            this.timeInput.value = `${this.selectedHour}:${this.selectedMinute} ${this.selectedAmPm}`;
            this.timePickerDiv.classList.remove("show");
            this.notifyOutputChanged();
        });

        buttonContainer.append(cancelButton, okButton);
        this.timePickerDiv.append(timeGrid, buttonContainer);
        this.container.append(inputContainer, this.timePickerDiv);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Update the view when the context changes
    }

    public getOutputs(): IOutputs {
        return { timeValue: `${this.selectedHour}:${this.selectedMinute} ${this.selectedAmPm}` };
    }

    public destroy(): void {
        //
    }

    /**
     * 🔄 Creates a Time Selector with Up/Down Arrows
     */
    private createTimeSelector(type: "hour" | "minute" | "ampm", values: number | string[], max?: number): HTMLDivElement {
        const box = document.createElement("div");
        box.classList.add("time-box");

        const upArrow = document.createElement("span");
        upArrow.classList.add("arrow");
        upArrow.innerHTML = "▲";

        const downArrow = document.createElement("span");
        downArrow.classList.add("arrow");
        downArrow.innerHTML = "▼";

        const timeValue = document.createElement("span");

        let currentValue: number | string = Array.isArray(values) ? values[0] : values;

        const updateTimeValue = () => {
            timeValue.innerText = currentValue.toString().padStart(2, "0");
            if (type === "hour") this.selectedHour = Number(currentValue);
            if (type === "minute") this.selectedMinute = Number(currentValue);
            if (type === "ampm") this.selectedAmPm = currentValue.toString();
        };

        upArrow.addEventListener("click", () => {
            if (type === "ampm") {
                currentValue = currentValue === "AM" ? "PM" : "AM";
            } else {
                currentValue = ((Number(currentValue) + 1) % (max! + 1));
                if (type === "hour" && currentValue === 0) currentValue = 1;
            }
            updateTimeValue();
        });

        downArrow.addEventListener("click", () => {
            if (type === "ampm") {
                currentValue = currentValue === "AM" ? "PM" : "AM";
            } else {
                currentValue = ((Number(currentValue) - 1 + (max! + 1)) % (max! + 1));
                if (type === "hour" && currentValue === 0) currentValue = max!;
            }
            updateTimeValue();
        });

        updateTimeValue();
        box.append(upArrow, timeValue, downArrow);
        return box;
    }

    private createColon(): HTMLSpanElement {
        const colon = document.createElement("span");
        colon.innerText = " : ";
        colon.style.fontSize = "20px";
        colon.style.padding = "0 5px";
        return colon;
    }
}
