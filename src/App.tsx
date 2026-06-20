import { useState } from "react";
import Button from "./components/Button";
import Input from "./components/Input";
import Card from "./components/Card";
import Alert from "./components/Alert";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [name, setName] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">
          Hospital Design System
        </h1>

        <Card>
          <h2 className="text-xl font-semibold mb-4">
            Buttons
          </h2>

          <div className="flex gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">
            Inputs
          </h2>

          <Input
            label="Patient Name"
            value={name}
            onChange={setName}
            placeholder="Enter patient name"
          />

          <Input
            label="Phone Number"
            value=""
            onChange={() => {}}
            error="Phone number is required"
          />
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">
            Alerts
          </h2>

          <div className="space-y-3">
            <Alert variant="success">
              Patient registered successfully.
            </Alert>

            <Alert variant="error">
              Failed to save patient.
            </Alert>

            <Alert variant="warning">
              Medicine stock is low.
            </Alert>

            <Alert variant="info">
              New appointment scheduled.
            </Alert>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">
            Loading Spinner
          </h2>

          <LoadingSpinner />
        </Card>

      </div>
    </div>
  );
}

export default App;