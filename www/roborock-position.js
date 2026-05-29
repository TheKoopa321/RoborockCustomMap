class RoborockPosition extends HTMLElement {
  setConfig(config) {
    if (!config.entity_x || !config.entity_y) {
      throw new Error("roborock-position: entity_x and entity_y are required");
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
            transition: left 0.5s ease, top 0.5s ease;
          }
          ha-icon {
            display: block;
            color: cyan;
            --mdc-icon-size: 32px;
            filter: drop-shadow(0 0 6px rgba(0, 255, 255, 0.9));
            transition: opacity 0.3s ease;
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

    const left = parseFloat(this._hass.states[this._config.entity_x]?.state);
    const top = parseFloat(this._hass.states[this._config.entity_y]?.state);

    if (!isNaN(left)) this.style.left = left + "%";
    if (!isNaN(top)) this.style.top = top + "%";

    const state = this._config.entity_state
      ? this._hass.states[this._config.entity_state]?.state
      : null;

    const icon = this.shadowRoot.querySelector("ha-icon");
    if (icon) {
      icon.style.opacity = state === "docked" ? "0.25" : "1";
    }
  }
}

customElements.define("roborock-position", RoborockPosition);
