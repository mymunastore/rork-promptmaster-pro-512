import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { MessageCircle, Send, Bot, User, Lightbulb, Copy, Check } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Card from '@/components/Card';


interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isPromptSuggestion?: boolean;
}

interface PromptChatCompanionProps {
  onPromptSuggestion: (prompt: string) => void;
  testID?: string;
}

const PromptChatCompanion: React.FC<PromptChatCompanionProps> = ({ 
  onPromptSuggestion, 
  testID 
}) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI Prompt Companion. I can help you create better prompts, suggest improvements, and answer questions about prompt engineering. What would you like to work on today?',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI prompt engineer and assistant. Help users create better prompts, suggest improvements, and provide guidance on prompt engineering best practices. When suggesting prompts, make them clear, specific, and effective. If you provide a complete prompt suggestion, mark it clearly so the user knows they can use it directly.'
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: userMessage.content
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.completion.trim(),
        timestamp: new Date(),
        isPromptSuggestion: data.completion.toLowerCase().includes('prompt:') || 
                           data.completion.toLowerCase().includes('here\'s a prompt') ||
                           data.completion.toLowerCase().includes('try this prompt')
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = async (message: Message) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(message.content);
      } else {
        Alert.alert('Copy Text', message.content, [
          { text: 'OK', style: 'default' }
        ]);
      }
      setCopiedMessageId(message.id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Error copying message:', error);
      Alert.alert('Copy Text', message.content, [
        { text: 'OK', style: 'default' }
      ]);
    }
  };

  const applyAsPrompt = (message: Message) => {
    onPromptSuggestion(message.content);
    Alert.alert('Success', 'Message has been applied as your prompt!');
  };

  const quickSuggestions = [
    'Help me write a prompt for creative writing',
    'How can I make my prompts more specific?',
    'Create a prompt for data analysis',
    'What makes a good AI prompt?',
  ];

  const handleQuickSuggestion = (suggestion: string) => {
    setInputText(suggestion);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.card,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: layout.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    title: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.text,
      marginLeft: layout.spacing.sm,
    },
    messagesContainer: {
      flex: 1,
      padding: layout.spacing.md,
    },
    messageWrapper: {
      marginBottom: layout.spacing.md,
    },
    userMessageWrapper: {
      alignItems: 'flex-end',
    },
    assistantMessageWrapper: {
      alignItems: 'flex-start',
    },
    messageBubble: {
      maxWidth: '80%',
      padding: layout.spacing.md,
      borderRadius: layout.borderRadius.lg,
    },
    userMessage: {
      backgroundColor: theme.primary,
      borderBottomRightRadius: layout.borderRadius.sm,
    },
    assistantMessage: {
      backgroundColor: theme.backgroundLight,
      borderBottomLeftRadius: layout.borderRadius.sm,
    },
    messageText: {
      fontSize: 14,
      lineHeight: 20,
    },
    userMessageText: {
      color: theme.card,
    },
    assistantMessageText: {
      color: theme.text,
    },
    messageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layout.spacing.xs,
    },
    messageRole: {
      fontSize: 12,
      fontWeight: '600' as const,
      marginLeft: layout.spacing.xs,
    },
    userRole: {
      color: theme.card,
    },
    assistantRole: {
      color: theme.textSecondary,
    },
    messageActions: {
      flexDirection: 'row',
      marginTop: layout.spacing.sm,
      gap: layout.spacing.sm,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs,
      borderRadius: layout.borderRadius.sm,
      backgroundColor: theme.background,
    },
    actionButtonText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: layout.spacing.xs,
    },
    quickSuggestions: {
      padding: layout.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    suggestionsTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.text,
      marginBottom: layout.spacing.sm,
    },
    suggestionButton: {
      backgroundColor: theme.backgroundLight,
      padding: layout.spacing.sm,
      borderRadius: layout.borderRadius.md,
      marginBottom: layout.spacing.xs,
    },
    suggestionText: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: layout.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      alignItems: 'flex-end',
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: layout.borderRadius.lg,
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      fontSize: 14,
      color: theme.text,
      backgroundColor: theme.background,
      maxHeight: 100,
    },
    sendButton: {
      marginLeft: layout.spacing.sm,
      width: 44,
      height: 44,
      borderRadius: layout.borderRadius.round,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: theme.border,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: layout.spacing.md,
    },
    loadingText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginLeft: layout.spacing.sm,
    },
  });

  return (
    <Card style={styles.container} testID={testID}>
      <View style={styles.header}>
        <MessageCircle size={20} color={theme.primary} />
        <Text style={styles.title}>AI Prompt Companion</Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageWrapper,
              message.role === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper
            ]}
          >
            <View style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage
            ]}>
              <View style={styles.messageHeader}>
                {message.role === 'user' ? (
                  <User size={14} color={theme.card} />
                ) : (
                  <Bot size={14} color={theme.textSecondary} />
                )}
                <Text style={[
                  styles.messageRole,
                  message.role === 'user' ? styles.userRole : styles.assistantRole
                ]}>
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </Text>
              </View>
              
              <Text style={[
                styles.messageText,
                message.role === 'user' ? styles.userMessageText : styles.assistantMessageText
              ]}>
                {message.content}
              </Text>

              {message.role === 'assistant' && (
                <View style={styles.messageActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => copyMessage(message)}
                  >
                    {copiedMessageId === message.id ? (
                      <Check size={12} color={theme.success} />
                    ) : (
                      <Copy size={12} color={theme.textSecondary} />
                    )}
                    <Text style={styles.actionButtonText}>
                      {copiedMessageId === message.id ? 'Copied!' : 'Copy'}
                    </Text>
                  </TouchableOpacity>
                  
                  {message.isPromptSuggestion && (
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => applyAsPrompt(message)}
                    >
                      <Lightbulb size={12} color={theme.accent3} />
                      <Text style={styles.actionButtonText}>Use as Prompt</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
        ))}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={styles.loadingText}>AI is thinking...</Text>
          </View>
        )}
      </ScrollView>

      {messages.length === 1 && (
        <View style={styles.quickSuggestions}>
          <Text style={styles.suggestionsTitle}>Quick Suggestions:</Text>
          {quickSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionButton}
              onPress={() => handleQuickSuggestion(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me about prompts..."
            placeholderTextColor={theme.textSecondary}
            multiline
            maxLength={500}
            testID="chat-input"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
            testID="send-button"
          >
            <Send size={20} color={theme.card} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Card>
  );
};

export default PromptChatCompanion;