// extending from HTMLElement allows us to have all the methods from an HTMLElement. Create the web component class:
class SmileRating extends HTMLElement {

  // use underscore to create a private variable inside the class
  _shadow = null;

  _value = null;
  get value() {
    return this._value
  }
  set value(v) {
    this._value = parseInt(v)
    if (this._value < -2 || this._value > 2) {
      if (this._value < -2) this._value = -2;
      if (this._value > 2) this._value = 2;
			console.warn("[SmileRating] Value should be between 2 and -2");
    }
    this._updateClasses();

    // Notify that we have change, onChange method
    this.dispatchEvent(new CustomEvent('change'));
  }

  get _buttons() {
    return [...this._shadow.querySelectorAll('li')];
  }

  connectedCallback() {
    //create the shadow dom root
    this._shadow = this.attachShadow({
      // if mode is closed we cannot access inside the shadow dom with JS / chrome devtools, if it's open, you will be able to do it.
      mode: 'closed'
    });

    // add this to the shadow dom root
    this._shadow.innerHTML = `
    <style>
      :host {
        user-select: none;
      }
      ul {
        border: 1px solid black;
        width: max-content;
        padding: 10px;
      }
      li { 
        display: inline-block;
        opacity: 0.4;
        font-size: 2.5rem;
        cursor: pointer;
        transition: transform .3s;
      }
      li:not(:first-of-type) {
        margin-left: 1rem;
      }
      li:hover {
        opacity: 0.6;
      }
      li.active {
        opacity: 1;
      }
      li.active,
      li:hover {
        transform: scale(1.1);
      }
    </style>

    <ul>
      <li data-value="-2">😡</li>
      <li data-value="-1">😖</li>
      <li data-value="0">😐</li>
      <li data-value="1">😃</li>
      <li data-value="2">😎</li>
    </ul>
    `;

    this._buttons.forEach(li => {
      li.addEventListener('click', () => {
        // when click on the emoji, we grad the data-value attribute, and assign as the value of the component / set value
        this.value = parseInt(li.getAttribute('data-value'));
      });
    });

  };

  _updateClasses() {
    this._buttons.forEach(li => {
      const valueNow = parseInt(li.getAttribute('data-value'));
      if (this.value === valueNow) return li.classList.add('active');
      else return li.classList.remove('active');
    })
  };

};

// Define your CUSTOM ELEMENT class
window.customElements.define(
  'smile-rating',
  SmileRating
);

// SHADOW DOM is a variation of the DOM tree encapsulated within the tree to an element  that doesn't leak, either in or out. So the styles are private. The styles will always reset for this specific web component.


// ctrl + cmd + space ==> opens the emoji window to choose