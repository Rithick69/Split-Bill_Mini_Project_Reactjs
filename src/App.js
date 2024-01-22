import "./styles.css";
import { useState } from "react";

const indata = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0
  }
];

export default function App() {
  return <SplitBill />;
}

function SplitBill() {
  const [data, setData] = useState(indata);
  const [showBtn, setshowBtn] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleAddFrnd = (val) => {
    setData((d) => [...d, val]);
    setshowBtn(false);
  };
  const handleShowAddFriend = () => {
    setshowBtn((show) => !show);
  };
  const handleSelection = (id) => {
    setSelected(...data.filter((curr) => curr.id === id));
  };
  const handleBillSplit = (val) => {
    setData((friends) =>
      friends.map((friend) =>
        friend.id === selected.id
          ? { ...friend, balance: friend.balance + val }
          : friend
      )
    );
    setSelected(null);
  };
  return (
    <>
      <div className="app">
        <div className="sidebar">
          <FriendList data={data} onselect={handleSelection} />
          {showBtn && <FormAddFriend onAddFriend={handleAddFrnd} />}

          <Button clickEvent={handleShowAddFriend}>
            {showBtn ? "Close" : "Add friend"}
          </Button>
        </div>
        {selected && (
          <FormSplitBill selected={selected} onSplitBill={handleBillSplit} />
        )}
      </div>
    </>
  );
}

function FriendList({ data, onselect }) {
  return (
    <ul>
      {data.map((curr, idx) => {
        return <Friend frnd={curr} key={idx} onselect={onselect} />;
      })}
    </ul>
  );
}

function Friend({ frnd, onselect }) {
  const { name, balance, id, image } = frnd;
  const handleSelect = () => {
    onselect(id);
  };
  return (
    <>
      <li>
        <img src={image} alt={name} />
        <h3>{name}</h3>
        {balance < 0 && (
          <p className="red">
            You owe {name} ${Math.abs(balance)}
          </p>
        )}
        {balance > 0 && (
          <p className="green">
            {name} owes you ${Math.abs(balance)}
          </p>
        )}
        {balance === 0 && <p>You and your friend are even.</p>}
        <Button clickEvent={handleSelect}>Select</Button>
      </li>
    </>
  );
}

function Button({ clickEvent, children }) {
  return (
    <button className="button" onClick={clickEvent}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  };

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label for="name">👩🏻‍🤝‍🧑🏻Friend's Name</label>
      <input
        type="text"
        name="name"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label for="img">🖼Image URL</label>
      <input
        type="text"
        name="img"
        id="img"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selected, onSplitBill }) {
  const { name } = selected;
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const handleSplit = (e) => {
    e.preventDefault();
    if (!bill || !paidByUser) return;

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  };
  return (
    <form className="form-split-bill" onSubmit={handleSplit}>
      <h2>Split the bill with {name} </h2>
      <label for="bill">💰Bill Value</label>
      <input
        type="number"
        name="bill"
        id="bill"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />

      <label for="paidByUser">🧍‍♂️Your expense</label>
      <input
        type="number"
        name="paidByUser"
        id="paidByUser"
        value={paidByUser}
        onChange={(e) => setPaidByUser(e.target.value)}
      />
      <label for="paidByFriend">👩🏻‍🤝‍🧑🏻{name}'s expense</label>
      <input
        type="number"
        name="paidByFriend"
        id="paidByFriend"
        value={paidByFriend}
      />
      <label>🤑Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
