import React, { useEffect, useState, useCallback } from "react";
import GameForm from "../../components/GameForm";
import PageTitle from "../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message, Table } from "antd";
import { Helmet } from "react-helmet";

function AdminGames() {
  const dispatch = useDispatch();
  const [showGameForm, setShowGameForm] = useState(false);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  const getGames = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/games/get-all-games", {});
      console.log(response);
      dispatch(HideLoading());
      if (response.data.success) {
        setGames(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  const deleteGame = async (_id) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.delete(`/api/games/${_id}`, {});

      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getGames();
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
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Board Number",
      dataIndex: "boardNumber",
    },
    {
      title: "Starting Date",
      dataIndex: "staringDate",
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        if (status === "Completed") {
          return <span className="text-red-500">{status}</span>;
        } else if (status === "running") {
          return <span className="text-yellow-500">{status}</span>;
        } else {
          return <span className="text-green-500">{status}</span>;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (actions, record) => (
        <div className="flex gap-3">
          <i
            className="ri-delete-bin-line cursor-pointer text-red-500 text-xl"
            onClick={() => deleteGame(record._id)}
          ></i>

          <i
            className="ri-pencil-line cursor-pointer text-xl"
            onClick={() => {
              setSelectedGame(record);
              setShowGameForm(true);
            }}
          ></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getGames();
  }, [getGames]);

  return (
    <>
      <Helmet>
        <title>Games</title>
      </Helmet>
      <div>
        <div className="flex justify-between p-7">
          <PageTitle title="Games" />
          <button
            type="submit"
            className="relative inline-flex items-center justify-start
                px-10 py-3 overflow-hidden font-bold rounded-full
                group"
            onClick={() => setShowGameForm(true)}
          >
            <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
            <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
            <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
              Add Game
            </span>
            <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
          </button>
        </div>
        <div className="p-7">
          <Table
            columns={columns}
            dataSource={games}
            pagination={{ pageSize: 7 }}
          />
          {showGameForm && (
            <GameForm
              showGameForm={showGameForm}
              setShowGameForm={setShowGameForm}
              type={selectedGame ? "edit" : "add"}
              selectedGame={selectedGame}
              setSelectedGame={setSelectedGame}
              getData={getGames}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default AdminGames;
