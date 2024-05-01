
import { useRendering } from "../helpers/use-rendering";
import { COMP_NAME } from "../types/constants";
import { captionedVideoSchema } from "../types/schema";
import { Button } from "./Button";
import { InputContainer } from "./Container";
import { DownloadButton } from "./DownloadButton";
import { ErrorComp } from "./Error";
import { Input } from "./Input";
import { ProgressBar } from "./ProgressBar";
import { Spacing } from "./Spacing";

export const RenderControls: React.FC<{
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  inputProps: captionedVideoSchema;
}> = ({ text, setText, inputProps }) => {
  const { renderMedia, state, undo } = useRendering(COMP_NAME, inputProps);

  return (
    <InputContainer>
      {state.status === "init" ||
      state.status === "invoking" ||
      state.status === "error" ? (
        <>
          <Input
            disabled={state.status === "invoking"}
            setText={setText}
            text={text}
          ></Input>
          <Spacing></Spacing>
          <div>
            <Button
              disabled={state.status === "invoking"}
              loading={state.status === "invoking"}
              onClick={renderMedia}
            >
              Render video
            </Button>
            </div>
          {state.status === "error" ? (
            <ErrorComp message={state.error.message}></ErrorComp>
          ) : null}
        </>
      ) : null}
      {state.status === "rendering" || state.status === "done" ? (
        <>
          <ProgressBar
            progress={state.status === "rendering" ? state.progress : 1}
          />
          <Spacing></Spacing>
          <div>
            <DownloadButton undo={undo} state={state}></DownloadButton>
          </div>
        </>
      ) : null}
    </InputContainer>
  );
};
