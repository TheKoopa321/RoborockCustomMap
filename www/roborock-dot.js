class RoborockDot extends HTMLElement {
  setConfig(config) {
    if (!config.entity_left || !config.entity_top) {
      throw new Error("roborock-dot: entity_left and entity_top are required");
    }
    this._config = config;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            position: absolute;
            transform: translate(-50%, -50%);
            pointer-events: none;
          }
          ha-icon {
            display: block;
            color: cyan;
            --mdc-icon-size: 32px;
            filter: drop-shadow(0 0 6px rgba(0, 255, 255, 0.9));
          }
        </style>
        <ha-icon icon="mdi:robot-vacuum"></ha-icon>
      `;
    }
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  _update() {
    if (!this._hass || !this._config || !this.shadowRoot) return;

    const vacuumState = this._hass.states[this._config.entity_vacuum]?.state;
    const active = ["cleaning", "returning", "manual"].includes(vacuumState);

    this.style.display = active ? "block" : "none";
    if (!active) return;

    const left = parseFloat(this._hass.states[this._config.entity_left]?.state);
    const top = parseFloat(this._hass.states[this._config.entity_top]?.state);

    if (!isNaN(left)) this.style.left = left + "%";
    if (!isNaN(top)) this.style.top = top + "%";
  }
}

customElements.define("roborock-dot", RoborockDot);
