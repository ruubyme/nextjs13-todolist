"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { CustomModalType, FocusedTodo, Todo } from "@/types";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "@/components/icons";
import CustomModal from "./custom-modal";

const TodoRow = (atodo: Todo) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();

  const applyIsDoneUI = (isDone: boolean) =>
    isDone ? "line-through text-gray-900/50 dark:text-white/40" : "";

  // 모달 상태
  const [currentModal, setCurrentModal] = useState<FocusedTodo>({
    focusedTodo: null,
    modalType: "detail" as CustomModalType,
  });

  const editATodoHandler = async (
    id: string,
    editedTitle: string,
    editedIsDone: boolean
  ) => {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${id}`, {
      method: "POST",
      body: JSON.stringify({
        title: editedTitle,
        is_done: editedIsDone,
      }),
      cache: "no-store",
    });
    router.refresh();
  };

  const deleteATodoHandler = async (id: string) => {
    //0.6초 딜레이
    // await new Promise((f) => setTimeout(f, 600));

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });

    router.refresh();
  };

  const ModalCompononet = () => {
    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
          <ModalContent>
            {(onClose) =>
              currentModal.focusedTodo && (
                <CustomModal
                  focusedTodo={currentModal.focusedTodo}
                  modalType={currentModal.modalType}
                  onClose={onClose}
                  onEdit={async (id, title, isDone) => {
                    await editATodoHandler(id, title, isDone);
                    onClose();
                  }}
                  onDelete={async (id) => {
                    await deleteATodoHandler(id);
                    onClose();
                  }}
                />
              )
            }
          </ModalContent>
        </Modal>
      </>
    );
  };

  return (
    <TableRow key={atodo.id}>
      <TableCell className={applyIsDoneUI(atodo.is_done)}>
        {atodo.id.slice(0, 4)}
      </TableCell>
      <TableCell className={applyIsDoneUI(atodo.is_done)}>
        {atodo.title}
      </TableCell>
      <TableCell>{atodo.is_done ? "✔️" : ""}</TableCell>
      <TableCell
        className={applyIsDoneUI(atodo.is_done)}
      >{`${atodo.created_at}`}</TableCell>
      <TableCell>
        <ModalCompononet />
        <div className="relative flex justify-end items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <VerticalDotsIcon className="text-default-300" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(key) => {
                setCurrentModal({
                  focusedTodo: atodo,
                  modalType: key as CustomModalType,
                });
                onOpen();
              }}
            >
              <DropdownItem key="detail">상세보기</DropdownItem>
              <DropdownItem key="edit">수정</DropdownItem>
              <DropdownItem key="delete">삭제</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </TableCell>
    </TableRow>
  );
};

const TodosTable = ({ todos }: { todos: Todo[] }) => {
  //할 일 추가 가능 여부
  const [todoAddEnable, setTodoAddEnable] = useState(false);
  // 입력된 할 일
  const [newTodoInput, setNewTodoInput] = useState("");

  //로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const addATodoHandler = async () => {
    if (newTodoInput.length < 1) {
      return;
    }
    setIsLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos`, {
      method: "POST",
      body: JSON.stringify({
        title: newTodoInput,
      }),
      cache: "no-store",
    });

    router.refresh();
    notifyEvent("할일이 성공적으로 추가되었습니다.");
    setNewTodoInput("");
    setTodoAddEnable(false);
    setIsLoading(false);
  };

  const notifyEvent = (msg: string) => toast.success(msg);

  const DisabledTodoAddButton = () => {
    return (
      <Popover placement="top" showArrow={true}>
        <PopoverTrigger>
          <Button color="default" className="h-14 ">
            추가
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <div className="text-small font-bold">🙆</div>
            <div className="text-tiny">할 일을 입력해주세요!</div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="flex flex-col space-y-2">
      <ToastContainer
        position="top-right"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Input
          type="text"
          label="새로운 할일"
          value={newTodoInput}
          onValueChange={(changedInput) => {
            setNewTodoInput(changedInput);
            setTodoAddEnable(changedInput.length > 0);
          }}
        />
        {todoAddEnable ? (
          <Button
            color="warning"
            className="h-14 "
            onPress={async () => {
              await addATodoHandler();
            }}
          >
            추가
          </Button>
        ) : (
          DisabledTodoAddButton()
        )}
      </div>
      <div className="h-3">
        {isLoading && <Spinner size="sm" color="warning" />}
      </div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>아이디</TableColumn>
          <TableColumn>할일내용</TableColumn>
          <TableColumn>완료여부</TableColumn>
          <TableColumn>생성일</TableColumn>
          <TableColumn>액션</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"할 일을 작성해주세요"}>
          {todos && todos.map((atodo: Todo) => TodoRow(atodo))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TodosTable;
