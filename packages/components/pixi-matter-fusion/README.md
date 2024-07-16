[![Release Train](https://github.com/laverve/fusion/actions/workflows/main.yaml/badge.svg?branch=main)](https://github.com/laverve/fusion/actions/workflows/main.yaml)

# @laverve/fusion - The lightweight Game Engine

This project aims to provide a frwmework for games built on top of [PixiJS](https://pixijs.com/) and [matter-js](https://brm.io/matter-js/).

It is designed to be used with [React](https://react.dev/) framework v18.2.0 or above.

# Installation

```
npm i --save @laverve/fusion
```

# Basic Usage Example

1. Create a component with `GameContextProvider` and `StageContextProvider`.
```
<GameContextProvider timeout={10}>
    <StageContextProvider config={{world: {width: 300, height: 300}, eventMode: "dynamic}}>
        <MyAwesomeStage />
    </StageContextProvider>
</GameContextProvider>
```

2. Create a component `MyAwesomeStage`.

```
export const MyAwesomeStage: React.FC<MazeHeroProps> = () => {
    const { status } = useContext(GameContext);
    const displayObjectConfig = useMemo(
        () => ({
            type: DisplayObjectType.SPRITE,
            url: "https://image_url",
            anchor: { x: 0.5, y: 0.5 },
        }),
        []
    );

    const [position, setPosition] = useState({x: 0, y: 0});

    useDisplayObjectFromConfig({
        ...displayObjectConfig,
        position: position
    });

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowUp":
                    setPosition({x: position.x, y: position.y - 1})
                    break;
                case "ArrowDown":
                    setPosition({x: position.x, y: position.y + 1})
                    break;
                case "ArrowRight":
                    setPosition({x: position.x + 1, y: position.y})
                    setDirection(90);
                    break;
                case "ArrowLeft":
                    setPosition({x: position.x - 1, y: position.y})
                    break;
                default:
                    break;
            }
        },
        [position]
    );

    useGlobalEventHandler({ event: "keydown", callback: onKeyDown, isEnabled: status === GameStatus.IN_PROGRESS });

    return null;
};
```

# Demos

* [Maze](https://laverve.github.io/games/?path=/story/games-maze-gameplay--maze-story)
* [WordSearch](https://laverve.github.io/games/?path=/story/games-wordsearch-gameplay--word-search-story)


# Contribution guidelines

You are encouraged to contribute to this project as soon as you see any defects or issues.

## Code Editor Configuration

This monorepo contains configuration for VSCode editor. It doesn't mean that you cannot use a different tool. Feel free to push configurations for your favourite code editor.

## Commands

1. To run tests use: `npm run test`
2. To build monorepo use: `npm run build`
3. To lint monorepo use: `npm run lint`
4. To initialize pre-commit hooks use: `npm run prepare`
5. To run storybook `npm run storybook`

## Workflow

Before you get started make sure that there is noone working on an issue you are going to address.

As a first step, clone the repository and run `npm i && npm run prepare` command to install all dependencies and initialize pre-commit hooks.

Create a branch to work on your code changes.

Once you are done with coding, create pull request and get an approval.

Lastly, enjoy your changes.


# License

This content is released under the ([http://opensource.org/licenses/MIT](http://opensource.org/licenses/MIT)) MIT License.
