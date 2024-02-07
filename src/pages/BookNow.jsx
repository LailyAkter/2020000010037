import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { Row, Col, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import PeopleSelection from "../components/PeopleSelection";
import { Helmet } from "react-helmet";

function BookNow() {
  const navigate = useNavigate();
  const [selectedPeople, setSelectedPeople] = useState([]);
  const params = useParams();
  const dispatch = useDispatch();
  const [game, setGame] = useState(null);

  const getGame = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(`/api/games/${params.id}`);
      dispatch(HideLoading());
      if (response.data.success) {
        setGame(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch, params.id]);

  const bookNow = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        `/api/bookings/book-people/${localStorage.getItem("user_id")}`,
        {
          game: game._id,
          people: selectedPeople
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/bookings");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getGame();
  }, [getGame]);

  return (
    <>
      <Helmet>
        <title>Book Now</title>
      </Helmet>
      <div>
        {game && (
          <Row className="m-3 p-5" gutter={[30, 30]}>
            <Col lg={12} xs={24} sm={24}>
              <h1 className="font-extrabold text-2xl text-blue-500">
                {game.name}
              </h1>
              <hr className="border-black" />

              <div className="flex w-60 flex-col ">
                <h1 className="text-lg mt-2 font-bold">
                  <span className="text-blue-600 italic">Max Players : </span>{" "}
                  <p>{game.maxPlayers}</p>
                </h1>
                <h1 className="text-lg font-bold">
                  <span className="text-blue-600 italic">People Available : </span>{" "}
                  <p>{game.maxPlayers - game.peopleBooked.length}</p>
                </h1>
              </div>

              <div className="flex flex-col gap-2 w-48 ">
                <h1 className="text-xl">
                  <b className="text-blue-600 italic">Selected People : </b>{" "}
                  {selectedPeople.join(", ")}
                </h1>

                <button
                  className={`${selectedPeople.length === 0
                      ? "animate-none cursor-not-allowed btn btn-primary py-2 px-5 rounded-full btn-disabled text-white"
                      : "animate-bounce btn btn-primary py-2 px-5 rounded-full bg-blue-600 hover:bg-blue-800 hover:duration-300 text-white"
                    }`}
                  onClick={bookNow}
                >
                  Pay Now
                </button>
              </div>
            </Col>
            <Col lg={12} xs={24} sm={24}>
              <PeopleSelection
                selectedPeople={selectedPeople}
                setSelectedPeople={setSelectedPeople}
                game={game}
              />
            </Col>
          </Row>
        )}
      </div>
    </>
  );
}

export default BookNow;
