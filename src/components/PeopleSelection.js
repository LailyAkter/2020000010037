import React from "react";
import { Row, Col } from "antd";

function PeopleSelection({ selectedPeople, setSelectedPeople, game }) {
  const maxPlayers = game.maxPlayers;

  const selectOrUnselectPeople = (peopleNumber) => {
    if (selectedPeople.includes(peopleNumber)) {
      setSelectedPeople(selectedPeople.filter((people) => people !== peopleNumber));
    } else {
      setSelectedPeople([...selectedPeople, peopleNumber]);
    }
  };
  return (
    <div className="m-5">
      <div className="w-[300px] border-2 text-xl font-bold border-blue-500 rounded p-[10px]">
        <Row gutter={[10, 10]}>
          {Array.from(Array(maxPlayers).keys()).map((people, key) => {
            let peopleClass = `btn btn-circle btn-outline bg-white cursor-pointer hover:bg-blue-600`;
            selectedPeople.includes(people + 1);
            if (selectedPeople.includes(people + 1)) {
              peopleClass = `btn btn-circle btn-outline bg-blue-500 cursor-pointer `;
            } else if (game.peopleBooked.includes(people + 1)) {
              peopleClass = `btn btn-circle btn-outline bg-red-500 pointer-events-none cursor-not-allowed`;
            }

            return (
              <Col key={key} span={6}>
                <div className="flex justify-center items-center">
                  <div
                    className={`border-[1px] text-black p-3 ${peopleClass}`}
                    onClick={() => {
                      selectOrUnselectPeople(people + 1);
                    }}
                  >
                    {people + 1}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

export default PeopleSelection;
