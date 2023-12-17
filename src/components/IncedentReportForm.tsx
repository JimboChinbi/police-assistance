import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useState } from 'react';
import axios from 'axios';
import success from '../assets/submit-successfully.png';

type EventChange =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;
export default function IncendentReportForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [reportsDetails, setReportsDetails] = useState({
    incident_report: '',
    location: '',
    datetime_occured: '',
    more_details: '',
  });

  const handleInputChange = (e: EventChange) => {
    const { name, value } = e.target;
    console.log(name, value);
    setReportsDetails((values) => ({ ...values, [name]: value }));
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = new FileReader();
    data.readAsDataURL(e.target.files![0]);

    data.onloadend = () => {
      const base64 = data.result;
      if (base64) {
        setImage(base64.toString());

        // console.log(base64.toString());
      }
    };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('dsadas');
    e.preventDefault();
    axios
      .post(`${import.meta.env.VITE_POLICE_ASSISTANCE}/reports.php`, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...reportsDetails,
        image,
      })
      .then((res) => {
        console.log(res.data);

        if (res.data.status === 'success') {
          setShowSuccess(true);
        }
      });
  };

  const handleOkay = () => {
    setShowSuccess(!showSuccess);
    window.location.reload();
  };

  return (
    <div className="w-full justify-center items-center flex ">
      <div className="w-[50%] border-2 p-4 text-start rounded-lg bg-white">
        <h1 className="text-center font-bold text-3xl">REPORT PAGE</h1>

        <form onSubmit={handleSubmit}>
          <div className="my-2">
            <Label>Incident report:</Label>
            <Input
              required
              name="incident_report"
              onChange={handleInputChange}
            />
          </div>

          <div className="my-2">
            <Label>Location:</Label>
            <Input required name="location" onChange={handleInputChange} />
          </div>

          <div className="my-2">
            <Label>Datetime:</Label>
            <Input
              required
              name="datetime_occured"
              onChange={handleInputChange}
              type="datetime-local"
            />
          </div>

          <div className="my-2">
            <Label>Image(optional)</Label>
            <Input
              onChange={handleChangeImage}
              required
              type="file"
              accept="image/*"
            />
          </div>

          <Textarea
            name="more_details"
            onChange={handleInputChange}
            className="my-2"
            placeholder="Please describe the incident or problem in detail"
          />
          <div className="my-2 w-full flex items-center justify-center">
            <Button className="w-[10rem] bg-[#125B50]">Submit</Button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <div className="absolute w-full flex justify-center items-center h-screen bg-white bg-opacity-90 ">
          <div className="w-[30%] rounded-xl bg-white border-2 h-fit p-4 flex flex-col items-center justify-center">
            <img className="w-[10rem]" src={success} alt="" />

            <h1 className="font-bold text-3xl">SUCCESSFULLY SUBMITTED</h1>

            <p>
              Rest assured, all the details you've submitted will remain
              completely anonymous.
            </p>

            <Button
              className="my-4 w-[15rem] bg-[#125B50]"
              onClick={handleOkay}
            >
              Okay
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
