import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPatient } from '../../services/patientService';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Alert from '../../components/Alert';

export default function AddPatient() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>)  {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await createPatient({ name, age: Number(age), gender: 'other', phone, bloodGroup, address, status: 'outpatient' });
      navigate('/patients');
    } catch {
      setError('Could not save patient');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Add patient</h1>
      <Card>
        {error && <div className="mb-4"><Alert variant="error">{error}</Alert></div>}
        <form onSubmit={handleSubmit}>
          <Input label="Name" value={name} onChange={setName} />
          <Input label="Age" type="number" value={age} onChange={setAge} />
          <Input label="Phone" value={phone} onChange={setPhone} />
          <Input label="Blood group" value={bloodGroup} onChange={setBloodGroup} />
          <Input label="Address" value={address} onChange={setAddress} />
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save patient'}</Button>
        </form>
      </Card>
    </Layout>
  );
}