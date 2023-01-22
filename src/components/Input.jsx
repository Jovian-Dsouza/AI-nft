import './Input.css';

export function Input() {
    return (
      <div class="input-group w-75 input-container">
        <input
          type="text"
          class="form-control"
          placeholder="Enter Something..."
          aria-label="Enter Something..."
          aria-describedby="basic-addon2"
        />
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button">
            Create
          </button>
        </div>
      </div>
    );
}