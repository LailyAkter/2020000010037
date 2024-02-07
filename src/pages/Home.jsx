import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Game from "../components/Game";
import { Row, Col, message, Form } from "antd";
import { Helmet } from "react-helmet";

function Home() {
  const dispatch = useDispatch();
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState({});

  const getGamesByFilter = useCallback(async () => {
    dispatch(ShowLoading());
    const staringDate = filters.staringDate;
    try {
      const { data } = await axiosInstance.post(
        `/api/games/get?staringDate=${staringDate}`
      );
      setGames(data.data);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.response.data.message);
    }
  }, [filters, dispatch]);

  useCallback(() => {
    if (filters.startTime || filters.endTime || filters.staringDate) {
      getGamesByFilter();
    }
  }, [filters.startTime, filters.endTime, filters.staringDate, getGamesByFilter]);

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div>
        <div className="full my-5 mx-2 p-2 px-2 py-3 flex justify-center">
          <Row gutter={10} align="center">
            <Col lg={12} sm={24}>
              <Form.Item
                label="Staring Time"
                name="startTime"
                placeholder="Please input Staring Time"
              >
                <input
                  onChange={(e) => {
                    setFilters({ ...filters, startTime: e.target.value });
                  }}
                  type="time"
                  className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
                />
              </Form.Item>
            </Col>
            <Col lg={12} sm={24}>
              <Form.Item
                label="End Time"
                name="endTime"
                placeholder="Please input End Time!"
              >
                <input
                  onChange={(e) => {
                    setFilters({ ...filters, endTime: e.target.value });
                  }}
                  type="time"
                  className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
                />
              </Form.Item>
            </Col>
            <Col lg={24} sm={24}>
              <input
                className="mb-5 input input-primary bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white "
                min={new Date().toISOString().split("T")[0]}
                type="date"
                placeholder="Date"
                onChange={(e) => {
                  setFilters({ ...filters, staringDate: e.target.value });
                }}
              />
            </Col>
            <Col lg={8} sm={24}>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    getGamesByFilter();
                  }}
                  className="relative inline-flex items-center justify-start
                    px-10 py-3 overflow-hidden font-bold rounded-full
                    group"
                >
                  <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                  <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
                  <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
                    Search
                  </span>
                  <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
                </button>
              </div>
            </Col>
          </Row>
        </div>
        <Row gutter={[15, 15]}>
          {games.map((game, index) => {
            return (
              <Col key={index} lg={24} sm={24}>
                <Game game={game} />
              </Col>
            );
          })}
          {games.length === 0 && (
            <div className="flex justify-center w-full">
              <h1 className="text-2xl font-bold text-gray-500">
                No Games found
              </h1>
            </div>
          )}
        </Row>
      </div>
    </>
  );
}

export default Home;
