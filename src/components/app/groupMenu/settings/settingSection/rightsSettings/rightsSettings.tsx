import styles from "./rightsSettings.module.scss";
import React from "react";
import {GroupDetailsForm} from "@/utils/types";
import CustomCheckboxSlide from "@/components/general/customCheckboxSlide/customCheckboxSlide";
import Image from "next/image";
import {groupRulesPrompts} from "@/utils/prompts";

interface DetailsSettingsProps {
    groupSettingsForm: GroupDetailsForm;
    setGroupSettingsForm: React.Dispatch<React.SetStateAction<GroupDetailsForm>>;
    defaultGroupSettingsForm: GroupDetailsForm;
    setIsSaveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isDisabled: boolean
}

export default function RightsSettings({groupSettingsForm, setGroupSettingsForm, defaultGroupSettingsForm, setIsSaveModalOpen, isDisabled}: DetailsSettingsProps) {
    const handleChange = (ruleIdToUpdate: string) => {
        setGroupSettingsForm((prev) => {
            const updatedRules = (prev.rules ?? []).map(rule =>
                rule.id === ruleIdToUpdate
                    ? { ...rule, value: !rule.value }
                    : rule
            );

            const updatedForm = { ...prev, rules: updatedRules };

            const hasChanges = JSON.stringify(updatedForm) !== JSON.stringify(defaultGroupSettingsForm);
            setIsSaveModalOpen(hasChanges);

            return updatedForm;
        });
    };

    return (
        <div className={styles.rightsSettingContainer}>
            <div>
                <h4>Droits des membres</h4>
                <p className={"groupSettingSubtitle"}>Gère les permissions accordés aux membres de ton groupe.</p>
            </div>

            <div className={styles.rightsSettingsRules}>
                {groupSettingsForm.rules?.map((rule) => (
                    <div key={`rule_${rule.code}`} className={styles.ruleContainer}>
                        <div className={styles.rule}>
                            <p>{groupRulesPrompts[rule.code].title}</p>
                            <CustomCheckboxSlide
                                isCheckboxCheck={rule.value}
                                handleChange={() => handleChange(rule.id)}
                                isDisabled={isDisabled}
                            />
                        </div>

                        {rule.code === "delete_games" && (
                            <div className={styles.subRuleContainer}>
                                <div className={styles.rule}>
                                    <div className={styles.subRuleTitle}>
                                        <Image
                                            src={"/icons/subElement.svg"}
                                            alt={"Sub element icon"}
                                            height={10}
                                            width={10}
                                        />
                                        <p>Limiter la suppression au propriétaire et aux modérateurs.</p>
                                    </div>

                                    <CustomCheckboxSlide
                                        isCheckboxCheck={false}
                                        handleChange={() => console.log("check")}
                                        isDisabled={true}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}