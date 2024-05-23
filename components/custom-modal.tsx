"use client";

import React, { useState } from "react";

import { Button } from "@nextui-org/button";

import "react-toastify/dist/ReactToastify.css";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Switch,
  CircularProgress,
} from "@nextui-org/react";
import { CustomModalType, Todo } from "@/types";

const CustomModal = ({
  focusedTodo,
  modalType,
  onClose,
  onEdit,
  onDelete,
}: {
  focusedTodo: Todo;
  modalType: CustomModalType;
  onClose: () => void;
  onEdit: (id: string, title: string, isDone: boolean) => void;
  onDelete: (id: string) => void;
}) => {
  //수정된 선택
  const [isDone, setIsDone] = useState(focusedTodo.is_done);

  //수정된 입력
  const [editedTodoInput, setEditedTodoInput] = useState(focusedTodo.title);

  //로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  const DetailModal = () => {
    return (
      <div>
        <ModalHeader className="flex flex-col gap-1">할일 상세</ModalHeader>
        <ModalBody>
          <p>
            <span className="font-bold">id : </span>
            {focusedTodo.id}
          </p>
          <p>
            <span className="font-bold">할일 내용 : </span>
            {focusedTodo.title}
          </p>
          <p>
            <span className="font-bold">완료여부 : </span>
            {focusedTodo.is_done ? "완료" : "미완료"}
          </p>
          <p>
            <span className="font-bold">작성일 : </span>
            {`${focusedTodo.created_at}`}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" onPress={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </div>
    );
  };

  const EditModal = () => {
    return (
      <>
        <ModalHeader className="flex flex-col gap-1">할일 수정</ModalHeader>
        <ModalBody>
          <p>
            <span className="font-bold">id : </span>
            {focusedTodo.id}
          </p>
          <Input
            isRequired
            autoFocus
            label="할일 내용"
            placeholder="할일을 입력해주세요"
            variant="bordered"
            value={editedTodoInput}
            onValueChange={setEditedTodoInput}
          />
          <div className="flex py-2 space-x-4">
            <span className="font-bold">완료여부 : </span>
            <Switch
              defaultSelected={focusedTodo.is_done}
              isSelected={isDone}
              onValueChange={setIsDone}
              aria-label="Automatic updates"
              color="warning"
            />
            {isDone ? "완료" : "미완료"}
          </div>
          <div className="flex px-1 py-1 space-x-4">
            <span className="font-bold">작성일 : </span>
            <p>{`${focusedTodo.created_at}`}</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="warning"
            variant="flat"
            onPress={() => {
              setIsLoading(true);
              onEdit(focusedTodo.id, editedTodoInput, isDone);
            }}
          >
            {isLoading ? (
              <CircularProgress
                size="sm"
                color="warning"
                aria-label="Loading..."
              />
            ) : (
              "수정"
            )}
          </Button>
          <Button color="default" onPress={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </>
    );
  };

  const DeleteModal = () => {
    return (
      <div>
        <ModalHeader className="flex flex-col gap-1">할일 삭제</ModalHeader>
        <ModalBody>
          <p>
            <span className="font-bold">id : </span>
            {focusedTodo.id}
          </p>
          <p>
            <span className="font-bold">할일 내용 : </span>
            {focusedTodo.title}
          </p>
          <p>
            <span className="font-bold">완료여부 : </span>
            {focusedTodo.is_done ? "완료" : "미완료"}
          </p>
          <p>
            <span className="font-bold">작성일 : </span>
            {`${focusedTodo.created_at}`}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="flat"
            onPress={() => {
              setIsLoading(true);
              onDelete(focusedTodo.id);
            }}
          >
            {isLoading ? (
              <CircularProgress
                size="sm"
                color="danger"
                aria-label="Loading..."
              />
            ) : (
              "삭제"
            )}
          </Button>
          <Button color="default" onPress={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </div>
    );
  };

  const getModal = (type: CustomModalType) => {
    switch (type) {
      case "detail":
        return DetailModal();
      case "edit":
        return EditModal();
      case "delete":
        return DeleteModal();
      default:
        break;
    }
  };

  return <>{getModal(modalType)}</>;
};

export default CustomModal;
