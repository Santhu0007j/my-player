import './Newclass.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Newclass() {
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    dob: '',
    age: '',
    gender: 'Male',
    patientId: '',
  });

  const [patientList, setPatientList] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartquantity, setCartQuantity] = useState({});

  const handleQuantity = (e, medicineID) => {
    setCartQuantity({
      ...cartquantity,
      [medicineID]: e.target.value,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo({
      ...patientInfo,
      [name]: value,
    });
  };

  const fetchPatientList = () => {
    axios
      .get('http://localhost:3000/data')
      .then((response) => {
        setPatientList(response.data);
      })
      .catch((error) => {
        console.error('Error retrieving patient data:', error);
      });
  };

  const handleAddToCart = (medicine, quantity) => {
    if (quantity !== null && quantity !== undefined && quantity !== '') {
      if (!cart.some((item) => item.MID === medicine.MID)) {
        setCart([...cart, { ...medicine, quantity }]);
      }
    } else {
      alert('Please enter a valid quantity before adding to cart.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !patientInfo.name ||
      !patientInfo.dob ||
      !patientInfo.age ||
      !patientInfo.gender ||
      !patientInfo.patientId
    ) {
      alert('Please fill in all fields before submitting.');
    } else {
        const formattedDate = new Date(patientInfo.dob).toLocaleDateString('en-GB');
      axios
        .post('http://localhost:3000/data',{ ...patientInfo,dob: formattedDate})
        .then(() => {
          setPatientInfo({
            name: '',
            dob: '',
            age: '',
            gender: 'Male',
            patientId: '',
          });
          fetchPatientList();
        })
        .catch((error) => {
          console.error('Error saving patient data:', error);
        });
    }
  };

 

  const medicinetable = () => {
    const medicineData = [
      { MID: '1', Mname: 'Medicine A', Price: '110', Dose: '2 tablets', AvailableQuantity: '100' },
      { MID: '2', Mname: 'Medicine B', Price: '150', Dose: '1 capsule', AvailableQuantity: '50' },
      { MID: '3', Mname: 'Medicine C', Price: '280', Dose: '1 tablet', AvailableQuantity: '75' },
      { MID: '4', Mname: 'Medicine D', Price: '250', Dose: '2 capsule', AvailableQuantity: '150' },
      { MID: '5', Mname: 'Medicine E', Price: '180', Dose: '2 tablet', AvailableQuantity: '150' },
    ];

    return (
      <div className="new">
        <h3>Medicine Information</h3>
        <table>
          <thead>
            <tr>
              <th>MID</th>
              <th>Mname</th>
              <th>Price</th>
              <th>Dose</th>
              <th>Available Quantity</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {medicineData.map((medicine, index) => (
              <tr key={index}>
                <td>{medicine.MID}</td>
                <td>{medicine.Mname}</td>
                <td>{medicine.Price}</td>
                <td>{medicine.Dose}</td>
                <td>{medicine.AvailableQuantity}</td>
                <td>
                  <input
                    type="number"
                    inputMode="numeric"
                    onChange={(e) => handleQuantity(e, medicine.MID)}
                  />
                </td>
                <td>
                  <button onClick={() => handleAddToCart(medicine, cartquantity[medicine.MID])}>
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const cartdetails = () => {

    const calculateTotalPrice = () => {
      let totalPrice = 0;
      cart.forEach((item) => {
        totalPrice += parseInt(item.Price) * item.quantity;
      });
      return totalPrice;
    };
    const tax =(calculateTotalPrice() * 18) / 100;
    const discount =(calculateTotalPrice() * 12) / 100
    const grandtotal =(calculateTotalPrice()-(tax+discount))
  
    return (
      <div className="new">
        <h3>Cart</h3>
        <div className="cartcontainer">
          <div className="newcart1">
            <table>
              <thead>
                <tr>
                  <th>MID</th>
                  <th>Mname</th>
                  <th>Dose</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td>{item.MID}</td>
                    <td>{item.Mname}</td>
                    <td>{item.Dose}</td>
                    <td>{item.quantity}</td>
                    <td>{parseInt(item.Price) * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="newcart">
            <table>
              <thead>
                <tr>
                  <th>List</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Medicine Price</td>
                  <td> {calculateTotalPrice()}</td>
                </tr>
                <tr>
                  <td>Tax</td>
                  <td> {tax}</td>
                </tr>
                <tr>
                  <td>Discount</td>
                  <td>{discount}</td>
                </tr>
                <tr>
                  <td>Grand Total</td>
                  <td>{grandtotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  

  useEffect(() => {
    fetchPatientList();
  }, []);

  return (
    <div className="App">
      <h3>Patient Information Form</h3>
      <form onSubmit={handleSubmit} action="post">
        <div>
          <label>
            Patient ID:
            <input type="text" name="patientId" value={patientInfo.patientId} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>
            Patient Name:
            <input type="text" name="name" value={patientInfo.name} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>
            Date of Birth:
            <input type="date" name="dob" value={patientInfo.dob} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>
            Age:
            <input type="text" name="age" value={patientInfo.age} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>
            Gender:
            <select name="gender" value={patientInfo.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>

        <button type="submit">Submit</button>
      </form>
      <div className="new">
        <h3>Patients Table</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Patient ID</th>
            </tr>
          </thead>
          <tbody>
            {patientList.map((patient, index) => (
              <tr key={index}>
                <td>{patient.name}</td>
                <td>{patient.dob}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.patientId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {medicinetable()}
      {cart.length > 0 && (
        <div className="cartdetails">{cartdetails()}</div>
      )}
    </div>
  );
}

export default Newclass; 