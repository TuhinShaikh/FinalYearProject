import React from "react";

export default function ParkingCardSlot({ slot, onSelect }) {
  const { id, status } = slot;

  const getColor = () => {
    switch (status) {
