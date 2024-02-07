import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Row, Form, Col, message, Upload, Button } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function GameForm({
  showGameForm,
  setShowGameForm,
  type = "add",
  getData,
  selectedGame,
  setSelectedGame,
}) {
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState('');
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (type === "add") {
        response = await axiosInstance.post("/api/games/add-game", values);
      } else {
        response = await axiosInstance.put(
          `/api/games/${selectedGame._id}`,
          values
        );
      }
      if (response.data.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
      getData();
      setShowGameForm(false);
      setSelectedGame(null);
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  return (
    <Modal
      width={800}
      title={type === "add" ? "Add Game" : "Update Game"}
      visible={showGameForm}
      onCancel={() => {
        setSelectedGame(null);
        setShowGameForm(false);
      }}
      footer={false}
    >
      <Form layout="vertical" onFinish={onFinish} initialValues={selectedGame}>
        <Row gutter={[10, 10]}>
          <Col lg={24} xs={24}>
            <Form.Item
              label="Game Name"
              name="name"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message:
                    type === "add"
                      ? "Please enter game name"
                      : "Please enter game name",
                },
              ]}
            >
              <input
                type="text"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label="Board Number"
              name="boardNumber"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message: "Please input board number!",
                },
              ]}
            >
              <input
                type="text"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label="Max Players"
              name="maxPlayers"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message: "Please input Max Players!",
                },
              ]}
            >
              <input
                type="number"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item
              label="Staring Date"
              name="staringDate"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message: "Please input staring date!",
                  validateTrigger: "onSubmit",
                },
              ]}
            >
              <input
                min={new Date().toISOString().split("T")[0]}
                type="date"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item
              label="Staring Time"
              name="startTime"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message: "Please input staring time!",
                  validateTrigger: "onSubmit",
                },
              ]}
            >
              <input
                type="time"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item
              label="End Time"
              name="endTime"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message: "Please input end time!",
                  validateTrigger: "onSubmit",
                },
              ]}
            >
              <input
                type="time"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: type === "add" ? true : true,
                  validateTrigger: "onSubmit",
                },
              ]}
            >
              <select
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
                name=""
                id=""
              >
                <option value="Yet to start">Yet To Start</option>
                <option value="Running">Running</option>
                <option disabled value="Completed">
                  Completed
                </option>
              </select>
            </Form.Item>
          </Col>
        </Row>
        <div className="flex justify-end">
          <button
            type="submit"
            className="relative inline-flex items-center justify-start
                px-10 py-3 overflow-hidden font-bold rounded-full
                group"
          >
            <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
            <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
            <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
              Save
            </span>
            <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default GameForm;
