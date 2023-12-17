import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from './ui/input';
import moment from 'moment';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type Report = {
  incident_report: string;
  location: string;
  datetime_occured: string;
  more_details: string;
  image: string;
  report_id: number;
  assigned: string;
  status: string;
};

type PoliceType = {
  police_name: string;
  assigned_location: string;
  phone_number: string;
  police_id: number;
  image: string;
};

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchReports, setSearchReports] = useState('');
  const [showImage, setShowImage] = useState(false);
  const [storeImage, setStoreImage] = useState('');
  const [showAssignPolice, setShowAssignPolice] = useState(false);
  const [police, setPolice] = useState<PoliceType[]>([]);
  const [searchPolice, setSearchPolice] = useState('');
  const [selectedPolice, setSelectedPolice] = useState('');
  const [selectedPoliceProfile, setSelectedPoliceProfile] = useState('');

  const [seletedReportID, setSelectedReportID] = useState<number>(0);
  const [seletedPoliceID, setSelectedPoliceID] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState('All');

  const getAllReports = () => {
    axios
      .get(`${import.meta.env.VITE_POLICE_ASSISTANCE}/reports.php`)
      .then((res) => {
        console.log(res.data, 'reports');
        if (res.data.length > 0) {
          setReports(res.data);
        }
      });
  };

  const getAllPolice = () => {
    axios
      .get(`${import.meta.env.VITE_POLICE_ASSISTANCE}/police.php`)
      .then((res) => {
        console.log(res.data, 'reports');
        if (res.data.length > 0) {
          setPolice(res.data);
        }
      });
  };

  useEffect(() => {
    getAllReports();
    getAllPolice();
  }, []);

  const handleShowImage = (image: string) => {
    setStoreImage(image);
    setShowImage(true);
  };

  const handleAssignPolice = (report_id: number) => {
    setShowAssignPolice(true);
    setSelectedReportID(report_id);
  };

  const handleSelectPolice = (
    police_name: string,
    police_image: string,
    police_id: number,
  ) => {
    setSelectedPolice(police_name);
    setSelectedPoliceProfile(police_image);
    setSelectedPoliceID(police_id);
  };

  const handleAssingedPolice = () => {
    axios
      .post(`${import.meta.env.VITE_POLICE_ASSISTANCE}/assign.php`, {
        police_id: seletedPoliceID,
        report_id: seletedReportID,
        assigned: selectedPolice,
      })
      .then((res) => {
        console.log(res.data);
        setShowAssignPolice(false);
        window.location.reload();
      });
  };

  const handleReportStatus = (report_id: number, status: string) => {
    axios
      .put(`${import.meta.env.VITE_POLICE_ASSISTANCE}/assign.php`, {
        report_id: report_id,
        status: status === 'Done' ? 'On Going' : 'Done',
      })
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      });
  };

  const handleFilterStatus = (value: string) => {
    const selected = value;
    console.log(selected);
    setSelectedStatus(selected);
  };

  return (
    <div className="relative">
      <div className="w-full bg-[#125B50] p-4 rounded-lg text-white">
        <h1 className="font-bold text-4xl text-start">Home</h1>
        <p className="text-start">See Latest Reports</p>
      </div>

      <div className="flex justify-start items-start my-[2rem]">
        <Link to="/police">
          <Button className="w-[15rem] bg-[#125B50]">Police</Button>
        </Link>
      </div>

      <div>
        <div className="flex justify-between">
          <Select onValueChange={handleFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>

              <SelectItem value="Done">Done</SelectItem>
              <SelectItem value="On Going">On Going</SelectItem>
            </SelectContent>
          </Select>
          <Input
            className="w-[20rem] my-2"
            placeholder="Search Reports"
            onChange={(e) => setSearchReports(e.target.value)}
          />
        </div>

        <Table className="border-2">
          <TableHeader className="bg-[#125B50] text-white">
            <TableRow>
              <TableHead className="text-white text-center">
                Date/Time Occured
              </TableHead>
              <TableHead className="text-white text-center">
                Incident Report
              </TableHead>
              <TableHead className="text-white text-center">Location</TableHead>

              <TableHead className="text-white text-center">
                More Details
              </TableHead>

              <TableHead className="text-white text-center">Image</TableHead>
              <TableHead className="text-white text-center">Assigned</TableHead>
              <TableHead className="text-white text-center">Status</TableHead>
              <TableHead className="text-white text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports
              .filter(
                (rep) =>
                  (rep.incident_report.includes(searchReports) ||
                    rep.status === '') &&
                  (selectedStatus === 'All' || rep.status === selectedStatus),
              )
              .map((rep, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {' '}
                    {moment(rep.datetime_occured).format('LLL')}
                  </TableCell>
                  <TableCell>{rep.incident_report}</TableCell>
                  <TableCell>{rep.location}</TableCell>

                  <TableCell>{rep.more_details}</TableCell>

                  <TableCell>
                    {rep.image.length > 0 ? (
                      <a
                        onClick={() => handleShowImage(rep.image)}
                        className="underline cursor-pointer"
                      >
                        show image
                      </a>
                    ) : (
                      <p>n/a</p>
                    )}
                  </TableCell>

                  <TableCell>{rep.assigned}</TableCell>
                  <TableCell>{rep.status}</TableCell>

                  <TableCell>
                    <Button
                      onClick={() =>
                        handleReportStatus(rep.report_id, rep.status)
                      }
                      className="mr-2 bg-[#125B50]"
                    >
                      {rep.status === 'Done' ? 'Set On Going' : 'Set Done'}
                    </Button>
                    <Button
                      className="bg-[#125B50]"
                      onClick={() => handleAssignPolice(rep.report_id)}
                    >
                      Assign Police
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {storeImage.length > 0 && showImage && (
        <div className="absolute w-full h-screen top-0 bg-white bg-opacity-90 flex justify-center items-center">
          <div className="w-[30%] h-[30rem] bg-white rounded-xl flex flex-col justify-center items-center">
            <img
              src={storeImage}
              alt="image"
              className="w-full h-full object-cover"
            />
            <Button onClick={() => setShowImage(false)}>Close</Button>
          </div>
        </div>
      )}

      {showAssignPolice && (
        <div className="absolute w-full h-screen top-0 bg-white bg-opacity-90 flex justify-center items-center">
          <div className="p-4 w-[60%] h-fit border-2 bg-white rounded-xl flex flex-col  items-center">
            <div className="w-full">
              <div className="w-full flex justify-end">
                <Input
                  onChange={(e) => setSearchPolice(e.target.value)}
                  className="w-[15rem] my-4"
                  placeholder="search police"
                />
              </div>
              <Table>
                <TableHeader className="bg-[#125B50]">
                  <TableRow>
                    <TableHead></TableHead>

                    <TableHead className="text-center text-white">
                      Name
                    </TableHead>
                    <TableHead className="text-center text-white">
                      Address
                    </TableHead>
                    <TableHead className="text-center text-white">
                      Phone
                    </TableHead>
                    <TableHead className="text-center text-white">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {police
                    .filter((poli) => poli.police_name.includes(searchPolice))
                    .map((pol, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <img
                              className="w-[5rem] rounded-lg h-[5rem] object-cover"
                              src={pol.image}
                              alt={pol.image}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {pol.police_name}
                          </TableCell>
                          <TableCell>{pol.assigned_location}</TableCell>
                          <TableCell>{pol.phone_number}</TableCell>

                          <TableCell>
                            <Button
                              className="bg-[#125B50]"
                              onClick={() =>
                                handleSelectPolice(
                                  pol.police_name,
                                  pol.image,
                                  pol.police_id,
                                )
                              }
                            >
                              Select
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                    .slice(0, 5)}
                </TableBody>
              </Table>
            </div>

            {selectedPolice.length > 0 && (
              <div className="w-full flex justify-start flex-col text-start my-[2rem] bg-[#125B50] p-2 text-white rounded-lg items-center">
                <h1 className="font-bold text-center">SELECTED POLICE</h1>
                <div className="w-full flex justify-center items-center">
                  <img
                    src={selectedPoliceProfile}
                    alt={selectedPoliceProfile}
                    className="w-[10rem] h-[10rem] object-cover"
                  />
                  <p className="font-bold text-2xl">{selectedPolice}</p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                className="bg-[#125B50]"
                onClick={() => setShowAssignPolice(false)}
              >
                Close
              </Button>

              <AlertDialog>
                <AlertDialogTrigger
                  className="bg-[#125B50] text-white font-bold w-[5rem] rounded-lg cursor-pointer"
                  disabled={selectedPolice.length > 0 ? false : true}
                >
                  Assign
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Read before you assign</AlertDialogTitle>
                    <AlertDialogDescription>
                      By clicking continue, you are assigning this police to
                      this report. and they will be notified about this report
                      through sms .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-[#125B50]"
                      onClick={handleAssingedPolice}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
