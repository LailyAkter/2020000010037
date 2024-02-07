import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message, Table } from "antd";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import PageTitle from "../../components/PageTitle";
import moment from "moment";
import { Helmet } from "react-helmet";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  const getBookings = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(
        `/api/bookings/get-all-bookings`,
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.game,
            key: booking._id,
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

  const columns = [
    {
      title: "Game Name",
      dataIndex: "name"
    },
    {
      title: "Full Name",
      dataIndex: "user",
      render: (user) => `${user.name}`,
    },

    {
      title: "Board Number",
      dataIndex: "boardNumber",
    },
    {
      title: "Staring Date",
      dataIndex: "staringDate",
      render: (staringDate) => moment(staringDate).format("DD/MM/YYYY"),
    },
    {
      title: "Staring Time",
      dataIndex: "startTime",
      render: (startTime) => moment(startTime, "HH:mm").format("hh:mm A"),
    },
    // {
    //   title: "People",
    //   dataIndex: "people",
    //   render: (people) => people.join(", "),
    // },
  ];

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  return (
    <>
      <Helmet>
        <title>User Bookings</title>
      </Helmet>
      <div className="p-5">
        <PageTitle title="Bookings" />
        <Table columns={columns} dataSource={bookings} />
      </div>
    </>
  );
}

export default AdminBookings;
