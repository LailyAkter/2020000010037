import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { message, Table, Modal } from "antd";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import PageTitle from "../components/PageTitle";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { Helmet } from "react-helmet";
import QRCode from "react-qr-code";

function Bookings() {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  const getBookings = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(
        `/api/bookings/${localStorage.getItem("user_id")}`,
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.game,
            key: booking._id,
            user: booking.user.name,
          };
        });
        setBookings(mappedData);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  const CancelBooking = async () => {
    try {
      dispatch(ShowLoading());
      const res = await axiosInstance.get(
        `/api/bookings/${localStorage.getItem("user_id")}`
      );
      const game_id = res.data.data[0].game._id;
      const user_id = res.data.data[0].user._id;
      const booking_id = res.data.data[0]._id;
      const response = await axiosInstance.delete(
        `/api/bookings/${booking_id}/${user_id}/${game_id}`,
        {}
      );
      console.log(response);
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getBookings();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Game Name",
      dataIndex: "name",
      key: "game",
    },
    {
      title: "Full Name",
      dataIndex: "user",
      key: "user",
    },

    {
      title: "Board Number",
      dataIndex: "boardNumber",
      key: "game",
    },
    {
      title: "Staring Date",
      dataIndex: "startingDate",
      render: (startingDate) => moment(startingDate).format("DD/MM/YYYY"),
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      render: (startTime) => moment(startTime, "HH:mm").format("hh:mm A"),
    },
    // {
    //   title: "People",
    //   dataIndex: "people",
    //   render: (people) => people.join(", "),
    // },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <button
            className="underline text-base text-green-500 cursor-pointer hover:text-green-700"
            onClick={() => {
              setSelectedBooking(record);
              setShowPrintModal(true);
            }}
          >
            View
          </button>
          <button
            className="underline text-base text-red-500 cursor-pointer hover:text-red-700"
            onClick={() => {
              CancelBooking();
            }}
          >
            Cancel
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Helmet>
        <title>Bookings</title>
      </Helmet>

      <div className="p-5">
        <PageTitle title="Bookings" />
        <Table columns={columns} dataSource={bookings} />

        {showPrintModal && (
          <Modal
            width={1000}
            height={500}
            title="Print Ticket"
            onCancel={() => {
              setShowPrintModal(false);
              selectedBooking(null);
            }}
            open={showPrintModal}
            okText="Print"
            onOk={handlePrint}
          >
            <div
              className="flex flex-col items-center justify-center bg-center bg-cover"
              ref={componentRef}
            >
              <div className="absolute bg-white opacity-80 inset-0 z-0"></div>
              <div className="max-w-md w-full h-full mx-auto z-10 bg-blue-900 rounded-3xl">
                <div className="flex flex-col">
                  <div className="bg-white relative drop-shadow-2xl  rounded-3xl p-4 m-4">
                    <div className="flex-none sm:flex">
                      <div className="flex-auto justify-evenly">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center my-1">
                            <span className="mr-3 rounded-full bg-white w-8 h-8">
                              <img alt="logo"  className="h-8 p-1" />
                            </span>
                            <h2 className="font-medium">
                              {selectedBooking?.name}
                            </h2>
                          </div>
                          <div className="ml-auto font-bold text-blue-600">
                            {selectedBooking?.user}
                          </div>
                        </div>
                        <div className="border-dashed border-b-2 my-5"></div>
                        <div className="flex items-center">
                          <div className="flex flex-col mx-auto">
                            <img  alt="logo" className="w-20 p-1" />
                          </div>
                        </div>
                        <div className="border-dashed border-b-2 my-5 pt-5">
                          <div className="absolute rounded-full w-5 h-5 bg-blue-900 -mt-2 -left-2"></div>
                          <div className="absolute rounded-full w-5 h-5 bg-blue-900 -mt-2 -right-2"></div>
                        </div>

                        <div className="flex items-center mb-4 px-5">
                          <div className="flex flex-col text-sm">
                            <span className="">Start Time</span>
                            <div className="font-semibold">
                              {moment(
                                selectedBooking?.startTime,
                                "HH:mm"
                              ).format("hh:mm A")}
                            </div>
                          </div>
                          <div className="flex flex-col mx-auto text-sm"></div>
                          <div className="flex flex-col text-sm">
                            <span className="">End Time</span>
                            <div className="font-semibold">
                              {moment(selectedBooking?.endTime, "HH:mm").format(
                                "hh:mm A"
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="border-dashed border-b-2 my-5 pt-5">
                          <div className="absolute rounded-full w-5 h-5 bg-blue-900 -mt-2 -left-2"></div>
                          <div className="absolute rounded-full w-5 h-5 bg-blue-900 -mt-2 -right-2"></div>
                        </div>
                        <div className="flex items-center px-5 pt-3 text-sm">
                          <div className="flex flex-col mx-auto">
                            <QRCode
                              value={JSON.stringify({
                                Name: selectedBooking?.user.toString(),
                                startTime: moment(
                                  selectedBooking?.startTime,
                                  "HH:mm"
                                ).format("hh:mm A"),

                                EndTime: moment(
                                  selectedBooking?.endTime,
                                  "HH:mm"
                                ).format("hh:mm A"),
                                people: selectedBooking?.people.toString(),
                                Date: selectedBooking?.staringDate.toString(),
                              })}
                              size={150}
                            />
                          </div>

                          {/* <div className="flex flex-col">
                            <span className="">people</span>
                            <div className="font-semibold">
                              {selectedBooking?.people.join(", ")}
                            </div>
                          </div> */}
                        </div>
                        <div className="flex flex-col py-5  justify-center text-sm ">
                          <div className="barcode h-14 w-0 inline-block mt-4 relative left-auto"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}

export default Bookings;
